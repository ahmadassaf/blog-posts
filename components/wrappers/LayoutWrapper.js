import Footer from '@/components/blocks/Footer';
import Header from '@/components/blocks/Header';
import SectionContainer from '@/components/containers/SectionContainer';

const LayoutWrapper = ({ navigationProps, children }) => (
  <SectionContainer>
    <div className='flex h-screen flex-col justify-between'>
      <Header navigationProps={ navigationProps }></Header>
      <main className='mb-8'>{children}</main>
      <Footer navigationProps={ navigationProps } />
    </div>
  </SectionContainer>
);

export default LayoutWrapper;
