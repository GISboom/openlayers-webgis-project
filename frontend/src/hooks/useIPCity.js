export default function useIPCity() {
  const key = import.meta.env.VITE_AMAP_KEY;
  const ipurl = "https://restapi.amap.com/v3/ip?key=" + key;

  const getNowCity = async () => {
    //获取当前城市信息
    const ipCity = await fetch(ipurl);
    const ipCityJson = await ipCity.json();
    const city = ipCityJson.city;
    
    return city;
  };
  return { getNowCity };
}
