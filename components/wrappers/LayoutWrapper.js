import Footer from '@/components/blocks/Footer'
import SectionContainer from '@/components/containers/SectionContainer'
import Header from '@/components/blocks/Header'

const LayoutWrapper = ({ navigationProps, children }) => {
  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <Header navigationProps={navigationProps}></Header>
        <main className="mb-auto">{children}</main>
        <Footer navigationProps={navigationProps} />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
