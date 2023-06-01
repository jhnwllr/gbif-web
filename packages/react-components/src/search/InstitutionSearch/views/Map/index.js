import React from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { ResourceLink } from '../../../../components';
import { InlineFilterChip } from '../../../../widgets/Filter/utils/FilterChip';
// import MercatorPointMap from './MercatorPointMap';
import MapPresentation from './MapPresentation';

const QUERY = `
query list($code: String, $q: String, $offset: Int, $limit: Int, $country: Country, $fuzzyName: String, $city: String, $name: String, $active: Boolean, $numberSpecimens: String, , $displayOnNHCPortal: Boolean){
  institutionSearch(code: $code, q: $q, limit: $limit, offset: $offset, country: $country, fuzzyName: $fuzzyName, city: $city, name: $name, active: $active, numberSpecimens: $numberSpecimens, displayOnNHCPortal: $displayOnNHCPortal) {
    count
    offset
    limit
    results {
      key
      name
      code
      active
      numberSpecimens
      address {
        city
        country
      }
      mailingAddress {
        city
        country
      }
    }
  }
}
`;


function Table() {
  const theme = useContext(ThemeContext);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const [filter, setFilter] = useState({});
  const [geojsonData, setGeojsonData] = useState(null);

  return <div style={{
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "row",
  }}>
    <Map popUpRef={popUpRef} geojsonData={geojsonData} filterHash={currentFilterContext.filterHash} {...props} theme={theme} style={{ width: '100%', height: '100%' }} />
  </div>
}

export default Table;