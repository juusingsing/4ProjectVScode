import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
function CmRouteChangeNotifier() {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

   useEffect(() => {
    if (window.Android && window.Android.receiveMessage) {
      window.Android.receiveMessage(JSON.stringify({
        type: "ROUTE_CHANGE",
        path: location.pathname,
        userId: user?.userId
      }));
    }
  }, [location]);

  return null;
}

export default CmRouteChangeNotifier;