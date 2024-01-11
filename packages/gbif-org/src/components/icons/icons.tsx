import { GenIcon } from 'react-icons';

// https://github.com/react-icons/react-icons/issues/238
// SVJ => JSON using https://react-icons-json-generator.surge.sh/

const gbifLogoJson = { "tag": "svg", "attr": { "viewBox": "90 239.1 539.7 523.9" }, "child": [{ "tag": "path", "attr": { "d": "M325.5,495.4c0-89.7,43.8-167.4,174.2-167.4C499.6,417.9,440.5,495.4,325.5,495.4" }, "child": [] }, { "tag": "path", "attr": { "d": "M534.3,731c24.4,0,43.2-3.5,62.4-10.5c0-71-42.4-121.8-117.2-158.4c-57.2-28.7-127.7-43.6-192.1-43.6\n\tc28.2-84.6,7.6-189.7-19.7-247.4c-30.3,60.4-49.2,164-20.1,248.3c-57.1,4.2-102.4,29.1-121.6,61.9c-1.4,2.5-4.4,7.8-2.6,8.8\n\tc1.4,0.7,3.6-1.5,4.9-2.7c20.6-19.1,47.9-28.4,74.2-28.4c60.7,0,103.4,50.3,133.7,80.5C401.3,704.3,464.8,731.2,534.3,731" }, "child": [] }] };
const gbifLogo = GenIcon(gbifLogoJson)
export const GbifLogoIcon = (props: React.ComponentPropsWithoutRef<'svg'>): React.JSX.Element => gbifLogo(props);
