import GardenLayout from '@/layouts/GardenLayout';

import allPlants from '../.contentlayer/generated/Plant/_index.json' assert { type: 'json' };

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

export default function Garden() {
  return (
    <>
      <GardenLayout posts={ allPlants }/>
    </>
  );
}
