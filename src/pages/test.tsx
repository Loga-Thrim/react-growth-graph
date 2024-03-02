import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import Data from "@/assets/population_continent.json";

interface IData {
  CountryName: string;
  Year: number;
  Population: number;
  continent: string;
  difference: number;
  index: number;
  flag: string;
}

const flag = (country: string) => {
  return (
    <div
      className={styles.flag}
      style={{
        background: `url(/images/${country})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  );
};

function groupAndSortBy(array: any[], groupByKey: string, sortByKey: string) {
  const grouped = array.reduce((result, currentValue) => {
    (result[currentValue[groupByKey]] =
      result[currentValue[groupByKey]] || []).push(currentValue);
    return result;
  }, {});

  Object.keys(grouped).forEach((key: any) => {
    grouped[key].sort((a: any, b: any) => b[sortByKey] - a[sortByKey]);
    grouped[key] = grouped[key].map((item: any, index: number) => ({
      ...item,
      index: index - 1,
    }));
  });

  return grouped;
}

const numberFormat = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Home() {
  const [listData, setListData] = useState<any[]>([]);
  const [year, setYear] = useState(1950);

  const initDataList = () => {
    const filtered = (Data as IData[]).filter(
      (item: any) => item.continent !== "" || item.CountryName === "World"
    );
    let _data = groupAndSortBy(filtered, "Year", "Population");

    setListData(_data);
  };

  useEffect(() => {
    if (Object.keys(listData).length === 0) initDataList();
  }, []);

  const shuffleList = () => {
    setYear(year + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.graph}>
        <div className={styles["break-point"]}>
          <span>0</span>
          <span style={{ marginRight: -40 }}>50,000,000</span>
          <span style={{ marginRight: -40 }}>100,000,000</span>
          <span style={{ marginRight: 60 }}>150,000,000</span>
        </div>

        <div className={styles.horizontal}>
          <div className={styles["y-key"]}>
            {listData[year]?.map((item: any, index: number) => (
              <span
                key={item.CountryName}
                style={{
                  top: item.index * 10 + "%",
                }}
              >
                {item.CountryName}
              </span>
            ))}
          </div>
          <div className={styles["y-bar"]}>
            <div className={styles["line-break-point"]}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            {listData[year]?.map((item: any, index: number) => (
              <div
                key={item.CountryName}
                className={styles["bar-container"]}
                style={{ top: item.index * 10 + "%" }}
              >
                <div
                  style={{
                    width:
                      (item.Population /
                        Math.max(
                          ...listData[year]?.map((item: any) => item.Population)
                        )) *
                        100 +
                      "%",
                  }}
                >
                  {flag(item.flag)}
                </div>
                <span>{numberFormat(item.Population)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={shuffleList}>Shuffle</button>
    </div>
  );
}
