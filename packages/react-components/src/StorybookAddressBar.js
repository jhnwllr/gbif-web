import React from 'react';
import { useLocation } from "react-router-dom";

export default function AddressBar() {
  const location = useLocation();
  return <div style={{padding: 12, background: '#555', color: 'white', fontSize: 12}}>
    {location.pathname}
  </div>
}