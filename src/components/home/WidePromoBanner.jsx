import React from 'react';
import { getImgUrl } from '../../utils/api';
import useHomeSettings from '../../hooks/useHomeSettings';
import './WidePromoBanner.css';

const WidePromoBanner = () => {
    const { settings, loading } = useHomeSettings();

    if (loading) return null;

    const banner = settings?.promoBanners?.[0]; // Use first promo banner for wide

    if (!banner) return null;

    return (
        <section className="wide-promo-section">
            <div className="wide-banner-ux">
                <div 
                    className="banner-bg-parallax" 
                    style={{ backgroundImage: `url(${getImgUrl(banner.image)})` }}
                ></div>
                <div className="banner-overlay-ux"></div>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="banner-content-lux">
                        <span className="banner-tag-lux">{banner.subtitle || 'Flash Collection'}</span>
                        <h2 className="banner-title-lux">{banner.title || 'Artisanal Selection'}</h2>
                        <p className="banner-desc-lux">{banner.description || 'Exclusive curated drapes for the finest homes. Starting at ₹1,499.'}</p>
                        <a href={banner.link || '/shop'} className="btn-lux">Explore the Sale</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WidePromoBanner;
