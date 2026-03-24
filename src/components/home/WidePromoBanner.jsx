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
            <div className="container">
                <a href={banner.link || '/shop'} className="wide-banner-link">
                    <div className="wide-banner" style={{ backgroundImage: `url(${getImgUrl(banner.image)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        {!banner.image && (
                            <div className="wide-banner-content">
                                <div className="left-promo">
                                    <span className="splash-text">Splash of</span>
                                    <h2 className="colours-text">{banner.title || 'COLOURS'} <span>Sale</span></h2>
                                </div>
                                <div className="divider"></div>
                                <div className="middle-promo">
                                    <p>{banner.subtitle}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </a>
            </div>
        </section>
    );
};

export default WidePromoBanner;
