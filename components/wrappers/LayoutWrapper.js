import SectionContainer from '@/components/containers/SectionContainer';
import ShapeContainer from '@/components/containers/ShapeContainer';
import Footer from '@/components/elements/Footer';
import Header from '@/components/elements/Header';

const LayoutWrapper = ({ children }) => (
  <div className='relative isolate overflow-x-hidden'>
    <ShapeContainer></ShapeContainer>
    <SectionContainer>
      <div className='flex h-screen flex-col justify-between'>
        <Header />
        <main className='mb-8'>{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  </div>

);

export default LayoutWrapper;
