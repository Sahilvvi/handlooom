import PromotionalBanner from '../components/home/PromotionalBanner';
import QuickLinks from '../components/home/QuickLinks';
import FiltrationGrid from '../components/home/FiltrationGrid';
import LatestDesigns from '../components/home/LatestDesigns';
import BudgetFriendly from '../components/home/BudgetFriendly';
import RoomTypeGrid from '../components/home/RoomTypeGrid';
import WidePromoBanner from '../components/home/WidePromoBanner';
import MaterialGrid from '../components/home/MaterialGrid';
import ColorGrid from '../components/home/ColorGrid';
import NewArrivals from '../components/home/NewArrivals';
import './Home.css';

const Home = () => {
    return (
        <main className="home-page">
            {/* 1. Promotional Banner (Hero) */}
            <PromotionalBanner />

            {/* 2. Quick Links (Circular Categories) */}
            <QuickLinks />

            {/* 3. Filtration Grid (Light Filtration) */}
            <FiltrationGrid />

            {/* 4. Latest Curtain Designs (Tabs + Grid) */}
            <LatestDesigns />

            {/* 5. Budget-Friendly Curtains */}
            <BudgetFriendly />

            {/* 6. Find the Perfect Curtains by Room Type */}
            <RoomTypeGrid />

            {/* 7. Wide Promotional Banner (50% OFF + Cashback) */}
            <WidePromoBanner />

            {/* 8. Shop Curtains By Material */}
            <MaterialGrid />

            {/* 9. Explore Curtains by Color */}
            <ColorGrid />

            {/* 10. New Arrivals */}
            <NewArrivals />
        </main>
    );
};

export default Home;
