import SearchbarContainer from './SearchbarContainer.jsx'
import MainCarousel from './MainCarousel.jsx'
import Cards from './Cards.jsx'
import HomeHowItWorks from './HomeHowItWorks.jsx'
import HomeSatisfactionContainer from './HomeSatisfactionContainer.jsx'
import VideoAdvertisement from './VideoAdvertisement.jsx'
import HomeReview from './HomeReview.jsx'
import GetStarted from '../../components/GetStarted/GetStarted.jsx'

const Home = () => {

  return <>
  {/* <Header/> */}
  <SearchbarContainer/>
  {/* <MainCarousel/> */}
  <Cards/>
  <HomeHowItWorks/>
  <HomeSatisfactionContainer/>
  <VideoAdvertisement/>
  <HomeReview/>
  <GetStarted/>
  {/* <Footer/> */}
  </>
}

export default Home;