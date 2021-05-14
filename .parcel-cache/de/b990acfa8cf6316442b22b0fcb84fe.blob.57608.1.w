var helpers = require("../../../node_modules/@parcel/transformer-react-refresh-wrap/lib/helpers/helpers.js");
var prevRefreshReg = window.$RefreshReg$;
var prevRefreshSig = window.$RefreshSig$;
helpers.prelude(module);
try {
  var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
  _parcelHelpers.defineInteropFlag(exports);
  _parcelHelpers.export(exports, "useFetch", function () {
    return useFetch;
  });
  var _d3Fetch = require("d3-fetch");
  var _react = require("react");
  var _s = $RefreshSig$();
  const useFetch = url => {
    _s();
    const [data, setData] = _react.useState([]);
    const [loading, setLoading] = _react.useState(true);
    async function fetchUrl() {
      const response = await _d3Fetch.csv(url);
      setData(response);
      setLoading(false);
    }
    _react.useEffect(() => {
      fetchUrl();
    }, []);
    return [data, loading];
  };
  _s(useFetch, "YP7e7Smzxlgf2d3MqLcgRZjo83U=");
  helpers.postlude(module);
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}