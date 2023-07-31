import Footer from '@/components/blocks/Footer';
import Header from '@/components/blocks/Header';
import SectionContainer from '@/components/containers/SectionContainer';
import ShapeContainer from '@/components/containers/ShapeContainer';

const LayoutWrapper = ({ navigation, children }) => (
  <div className='relative isolate'>
    <ShapeContainer></ShapeContainer>
    <SectionContainer>
      <div className='flex h-screen flex-col justify-between'>
        <Header navigation={ navigation }></Header>
        <main className='mb-8'>{children}</main>
        <Footer navigation={ navigation } />
      </div>
    </SectionContainer>
  </div>

);

export default LayoutWrapper;
