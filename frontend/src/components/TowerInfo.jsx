
// const TowerInfo = ({ feature, x, y }) => {
//   return (
//     <div className="tower-popup" style={{ left: x, top: y }}>
//       <div>Cell Name: {feature.properties["Cell Name"]}</div>
//       <div>Cell Label: {feature.properties["Cell Label"]}</div>
//       <div>Vendor: {feature.properties.vendor}</div>
//       <div>Band: {feature.properties.Band}</div>
//     </div>
//   );
// };

// export default TowerInfo;

import React from 'react';

// Define the TowerInfo component
const TowerInfo = ({ siteInfo }) => {
  // Define inline styles for the component
  const styles = {
    container: {
      
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    heading: {
      fontSize: '1.5rem',
      marginBottom: '12px',
    },
    infoItem: {
      marginBottom: '8px',
    },
  };

  // Render the TowerInfo component with inline styles
  return (
    <div style={{
      top:0,
      right:-150,
      position: 'absolute',
      
      transform: 'translate(-50%, -50%)',
      padding: '16px',
      background: '#ffffff',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      zIndex: '9999', // Ensure it's above other elements
    }}>
      <h2 style={styles.heading}>Tower Information</h2>
      {siteInfo && (
        <div>
          <p style={styles.infoItem}>Station: {siteInfo.station}</p>
          <p style={styles.infoItem}>Vendor: {siteInfo.vendor}</p>
          {/* Other site information */}
        </div>
      )}
    </div>
  );
};

export default TowerInfo;
