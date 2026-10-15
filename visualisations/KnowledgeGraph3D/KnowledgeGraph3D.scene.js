/*
 * The Three.js side of KnowledgeGraph3D, loaded only in the browser. It draws the graph once and
 * exposes small setters (view, focus, theme) so React stays the single owner of state. Labels are
 * HTML through CSS2DRenderer so they stay crisp and take the page's font and colours.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import { edges, neighboursOf, nodes, nodeTypes } from './KnowledgeGraph3D.data.js';

const NODE_RADIUS = 0.55;

// Resolve any CSS colour (tokens may be oklch) to sRGB by painting one pixel.
const resolveColour = (element, cssValue) => {
  const probe = document.createElement('span');

  probe.style.color = cssValue;
  element.appendChild(probe);
  const computed = window.getComputedStyle(probe).color;

  probe.remove();
  const canvas = document.createElement('canvas');

  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext('2d');

  context.fillStyle = computed;
  context.fillRect(0, 0, 1, 1);
  const [ red, green, blue ] = context.getImageData(0, 0, 1, 1).data;

  return new THREE.Color(red / 255, green / 255, blue / 255);
};

// The labelled view is monochrome, so only the focused node takes the accent there.
const nodeColour = (palette, view, type, isFocus) => {
  if (view !== 'labelled') return palette[type];

  return isFocus ? palette.focus : palette.neutral;
};

const labelState = (active, isFocus) => {
  if (!active) return 'dim';

  return isFocus ? 'focus' : 'on';
};

// Edges stay readable with nothing focused; with a focus, its edges lead and the rest recede.
const edgeOpacity = (focusId, incident) => {
  if (!focusId) return 0.55;

  return incident ? 1 : 0.08;
};

const formatProperties = (properties) => Object.entries(properties).map(([ key, value ]) => `${key}: ${value}`).join(' · ');

/**
 * Builds the scene inside `container`
 *
 * @param {Object} options - Scene options
 * @param {HTMLElement} options.container - Element the canvas and label layer fill
 * @param {Record<string, number[]>} options.positions - Node positions from layoutGraph
 * @param {Object} options.classNames - CSS module classes for node, edge and property labels
 * @param {Function} options.onSelect - Called with a node id when a node is clicked
 * @param {Function} options.onHover - Called with a node id or null as the pointer moves
 * @param {boolean} options.reducedMotion - Disables the idle rotation
 * @returns {{ setView: Function, setFocus: Function, refreshTheme: Function, dispose: Function }} Scene handle
 */
export function createScene({ classNames, container, onHover, onSelect, positions, reducedMotion }) {
  const width = () => container.clientWidth;
  const height = () => container.clientHeight;

  const renderer = new THREE.WebGLRenderer({ 'alpha': true, 'antialias': true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width(), height());
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();

  labelRenderer.setSize(width(), height());
  labelRenderer.domElement.className = classNames.labelLayer;
  container.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width() / height(), 0.1, 200);

  camera.position.set(0, 5, 26);

  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const light = new THREE.DirectionalLight(0xffffff, 1.4);

  light.position.set(8, 12, 10);
  scene.add(light);

  // Drag to orbit; the page keeps the wheel and one-finger scrolling.
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.5;
  controls.touches = { 'ONE': null, 'TWO': THREE.TOUCH.ROTATE };
  renderer.domElement.style.touchAction = 'pan-y';
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
  });

  const graph = new THREE.Group();

  scene.add(graph);

  // Nodes: a sphere and an HTML label each
  const degree = Object.fromEntries(nodes.map((node) => [ node.id, edges.filter((edge) => edge.from === node.id || edge.to === node.id).length ]));
  const sphere = new THREE.SphereGeometry(NODE_RADIUS, 32, 16);
  const nodeObjects = nodes.map((node) => {
    const material = new THREE.MeshStandardMaterial({ 'roughness': 0.45, 'transparent': true });
    const mesh = new THREE.Mesh(sphere, material);
    const scale = 0.8 + Math.min(degree[node.id], 7) * 0.08;

    mesh.scale.setScalar(scale);
    mesh.position.fromArray(positions[node.id]);
    mesh.userData.nodeId = node.id;
    graph.add(mesh);

    const label = document.createElement('div');

    label.className = classNames.nodeLabel;
    const name = document.createElement('span');

    name.textContent = node.label;
    const properties = document.createElement('span');

    properties.className = classNames.propertyLabel;
    properties.textContent = formatProperties(node.properties);
    label.append(name, properties);
    const labelObject = new CSS2DObject(label);

    labelObject.position.set(0, NODE_RADIUS * scale + 0.45, 0);
    mesh.add(labelObject);

    return { label, material, mesh, node, properties, scale };
  });
  const nodeObjectById = Object.fromEntries(nodeObjects.map((object) => [ object.node.id, object ]));

  // Edges: a line, an arrowhead at the target's surface, and a label at the midpoint
  const cone = new THREE.ConeGeometry(0.16, 0.45, 12);
  const edgeObjects = edges.map((edge) => {
    const from = nodeObjectById[edge.from];
    const to = nodeObjectById[edge.to];
    const start = from.mesh.position.clone();
    const end = to.mesh.position.clone();
    const direction = end.clone().sub(start).normalize();
    const lineStart = start.clone().addScaledVector(direction, NODE_RADIUS * from.scale);
    const lineEnd = end.clone().addScaledVector(direction, -NODE_RADIUS * to.scale - 0.4);

    const material = new THREE.LineBasicMaterial({ 'transparent': true });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([ lineStart, lineEnd ]), material);

    graph.add(line);

    const arrowMaterial = new THREE.MeshBasicMaterial({ 'transparent': true });
    const arrow = new THREE.Mesh(cone, arrowMaterial);

    arrow.position.copy(lineEnd).addScaledVector(direction, 0.2);
    arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    graph.add(arrow);

    const label = document.createElement('div');

    label.className = classNames.edgeLabel;
    const name = document.createElement('span');

    name.textContent = edge.label;
    const properties = document.createElement('span');

    properties.className = classNames.propertyLabel;
    properties.textContent = formatProperties(edge.properties);
    label.append(name, properties);
    const labelObject = new CSS2DObject(label);

    // Past the midpoint, so the labels of a hub's many edges spread out instead of crowding the hub
    labelObject.position.copy(lineStart.clone().lerp(lineEnd, 0.6));
    graph.add(labelObject);

    return { arrowMaterial, edge, label, material, properties };
  });

  let view = 'typed';
  let focusId = null;
  let palette = {};

  // One pass sets colours, dimming and label visibility from the view and the focused node
  const apply = () => {
    const neighbours = focusId ? neighboursOf(focusId) : null;
    const inFocus = (nodeId) => !focusId || nodeId === focusId || neighbours.has(nodeId);

    for (const object of nodeObjects) {
      const isFocus = object.node.id === focusId;
      const colour = nodeColour(palette, view, object.node.type, isFocus);
      const active = inFocus(object.node.id);

      object.material.color.copy(colour);
      object.material.opacity = active ? 1 : 0.18;
      object.material.emissive.copy(colour).multiplyScalar(isFocus ? 0.35 : 0);
      object.label.dataset.state = labelState(active, isFocus);

      // Properties belong to the focused node only; on every node at once they would bury the graph
      object.properties.hidden = view !== 'property' || !isFocus || !Object.keys(object.node.properties).length;
    }

    for (const object of edgeObjects) {
      const incident = focusId && (object.edge.from === focusId || object.edge.to === focusId);
      const colour = incident ? palette.edgeActive : palette.edge;

      object.material.color.copy(colour);
      object.arrowMaterial.color.copy(colour);
      object.material.opacity = edgeOpacity(focusId, incident);
      object.arrowMaterial.opacity = object.material.opacity;

      // Edge labels belong to the focused node; the labelled view also shows them all when nothing is focused
      object.label.hidden = !(incident || (!focusId && view === 'labelled'));
      object.properties.hidden = view !== 'property' || !Object.keys(object.edge.properties).length;
    }
  };

  const refreshTheme = () => {
    palette = {
      'edge': resolveColour(container, 'var(--ds-color-text-subtle)'),
      'edgeActive': resolveColour(container, 'var(--ds-color-text)'),
      'focus': resolveColour(container, 'var(--ds-color-accent)'),
      'neutral': resolveColour(container, 'var(--ds-color-text-muted)'),
      ...Object.fromEntries(nodeTypes.map((type) => [ type.id, resolveColour(container, `var(--ds-color-${type.tone})`) ]))
    };
    apply();
  };

  // Picking: hover changes the cursor, a click that did not drag selects
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pressedAt = null;
  let hoveredId = null;

  const pick = (event) => {
    const bounds = renderer.domElement.getBoundingClientRect();

    pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const [ hit ] = raycaster.intersectObjects(nodeObjects.map((object) => object.mesh));

    return hit?.object.userData.nodeId ?? null;
  };

  const onPointerMove = (event) => {
    const nodeId = pick(event);

    renderer.domElement.style.cursor = nodeId ? 'pointer' : 'grab';
    if (nodeId !== hoveredId) {
      hoveredId = nodeId;
      onHover(nodeId);
    }
  };
  const onPointerDown = (event) => {
    pressedAt = [ event.clientX, event.clientY ];
  };
  const onPointerUp = (event) => {
    if (!pressedAt || Math.hypot(event.clientX - pressedAt[0], event.clientY - pressedAt[1]) > 5) return;
    const nodeId = pick(event);

    if (nodeId) onSelect(nodeId);
  };
  const onPointerLeave = () => {
    hoveredId = null;
    onHover(null);
  };

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);

  // Render only while on screen
  let frame = 0;
  let visible = false;
  const loop = () => {
    frame = visible ? window.requestAnimationFrame(loop) : 0;
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  };
  const intersection = new window.IntersectionObserver(([ entry ]) => {
    visible = entry.isIntersecting;
    if (visible && !frame) frame = window.requestAnimationFrame(loop);
  });

  intersection.observe(container);

  const resize = new window.ResizeObserver(() => {
    camera.aspect = width() / height();
    camera.updateProjectionMatrix();
    renderer.setSize(width(), height());
    labelRenderer.setSize(width(), height());
    if (!frame) loop();
  });

  resize.observe(container);

  // Theme switches swap the page's colour tokens
  const theme = new window.MutationObserver(refreshTheme);

  theme.observe(document.documentElement, { 'attributeFilter': [ 'class', 'data-theme' ], 'attributes': true });
  refreshTheme();

  return {
    'dispose': () => {
      window.cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      theme.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      sphere.dispose();
      cone.dispose();
      nodeObjects.forEach((object) => object.material.dispose());
      edgeObjects.forEach((object) => {
        object.material.dispose();
        object.arrowMaterial.dispose();
      });
      graph.traverse((child) => child.geometry?.dispose?.());
      renderer.dispose();
      renderer.domElement.remove();
      labelRenderer.domElement.remove();
    },
    refreshTheme,
    'setFocus': (nodeId) => {
      focusId = nodeId;
      apply();
    },
    'setView': (nextView) => {
      view = nextView;
      apply();
    }
  };
}
