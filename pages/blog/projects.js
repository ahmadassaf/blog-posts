import Card from '@/components/elements/Card';
import { PageSEO } from '@/components/utils/SEO';
import siteMetadata from '@/data/meta/metadata';
import { getAllFilesFrontMatter } from '@/lib/mdx';

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog');
  const projects = posts.filter((post) => post.type === 'project');

  return { 'props': { projects } };
}

export default function Projects({ projects }) {
  return (
    <>
      <PageSEO title={ `Projects - ${siteMetadata.author}` } description={ siteMetadata.description } />
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14'>
            Projects
          </h1>
        </div>
        <div className='py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            {projects.map((project) => (
              <Card key={ project.title } title={ project.title } subtitle={ project.subtitle } description={ project.summary } href={ `/blog/${project.slug}` } />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
