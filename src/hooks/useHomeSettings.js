import { useState, useEffect } from 'react';
import BASE_URL from '../utils/api';

const useHomeSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_URL}/api/home`)
            .then(r => r.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return { settings, loading };
};

export default useHomeSettings;
