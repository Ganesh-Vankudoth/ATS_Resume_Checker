import { useEffect, useState } from "react";
import axios from 'axios';

function FirstAppStatus() {
    const [connectionData, setConnectionData] = useState({ message: "connecting..." });

    useEffect(() => {
        // Calls your path('first/', include('firstapp.urls'))
        axios.get('http://127.0.0.1:8000/first/') 
            .then(res => setConnectionData(res.data))
            .catch(err => setConnectionData({ message: "Backend Offline" }));
    }, []);

    return (
        <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
            Server Status: {connectionData.message}
        </div>
    );
}

export default FirstAppStatus;