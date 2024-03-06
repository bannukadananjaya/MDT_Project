
const MarkerInfo = ({info,onClose}) => {
 

    return (
      <div className="marker-info">
        <h2>Tower Information:</h2>
        <button onClick={onClose} className="button">close</button>
        <ul>
          <li>
            Site ID: <strong>{info.id.siteID}</strong>
          </li>
          <li>
            Tower Name: <strong>{info.title.BaseStatio}</strong>
          </li>
          <li>
            VENDOR: <strong>{info.vendor.vendor}</strong>
          </li>
        </ul>
      </div>
    );
  };
  export default MarkerInfo;