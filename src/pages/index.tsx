import { useEffect, useState } from "react";
import CountUp from "react-countup";

import styles from "@/styles/Home.module.css";
import Data from "@/assets/population_continent.json";
import Countries from "@/assets/countries.json";

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

const continentBackgroundColor = (continent: string) => {
  switch (continent) {
    case "AF":
      return "rgb(255, 98, 131)";
    case "AS":
      return "rgb(67, 40, 231)";
    case "EU":
      return "rgb(150, 84, 229)";
    case "SA":
      return "rgb(255, 197, 2)";
    case "NA":
      return "rgb(255, 197, 2)";
    case "OC":
      return "rgb(255, 136, 0)";
    default:
      return "rgba(255, 255, 255)";
  }
};

const numberFormat = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Home() {
  const [listData, setListData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [year, setYear] = useState(1950);

  const markPoints = [
    200000000, 400000000, 600000000, 800000000, 1000000000, 1500000000,
    2000000000,
  ];
  const [passedPoints, setPassedPoints] = useState<number[]>(
    markPoints.slice(0, 2)
  );

  const initDataList = () => {
    const filtered = (Data as IData[])
      .filter(
        (item: any) => item.continent !== "" || item.CountryName === "World"
      )
      .map(
        ({
          CountryName,
          Year,
          Population,
          continent,
          difference,
          index,
          flag,
        }: any) => ({
          CountryName,
          Year,
          Population,
          continent,
          difference,
          index,
          flag,
        })
      );
    let groupsData = groupAndSortBy(filtered, "Year", "Population");
    setListData(groupsData);
  };

  const setDataByCountry = () => {
    const groupsData = listData;
    const _data = [];

    for (const country of Countries as any[]) {
      const groupData = groupsData[year].find(
        (item: any) => item.CountryName === country
      );

      if (groupData) {
        _data.push({
          CountryName: country,
          flag: "",
          Population: groupData.Population,
          Year: year,
          continent: groupData.continent,
          difference: groupData.difference,
          index: groupData.index,
        });
      }
    }

    setData(_data);
  };

  const countStartByName = (name: string, year: number) => {
    return listData[year]?.filter((f: any) => f.CountryName === name)[0];
  };

  const setMarkPoint = () => {
    setData((prevData) => {
      setPassedPoints((prevPassedPoints) => {
        const markPointIndex = markPoints.indexOf(prevPassedPoints.length - 1);
        if (
          prevData.find((item: any) => item.index === 0)?.Population >=
            markPoints[markPointIndex + 1] &&
          prevPassedPoints.indexOf(markPoints[markPointIndex + 1]) === -1
        )
          return [...prevPassedPoints, markPoints[markPointIndex + 1]];
        else return prevPassedPoints;
      });

      return prevData;
    });
  };

  useEffect(() => {
    if (Object.keys(listData).length === 0) initDataList();
  }, []);

  useEffect(() => {
    if (Object.keys(listData).length > 0) setDataByCountry();
  }, [listData, year]);

  // useEffect(() => {
  //   if (Object.keys(listData).length > 0) {
  //     setInterval(() => {
  //       setYear((prev) => {
  //         if (prev < 2021) {
  //           return prev + 1;
  //         } else {
  //           setPassedPoints(markPoints.slice(0, 2));
  //           return 1950;
  //         }
  //       });
  //       setMarkPoint();
  //     }, 500);
  //   }
  // }, [listData]);

  return (
    <div className={styles.container}>
      <div className={styles.graph}>
        <div className={styles["break-point"]}>
          <span>0</span>
          <span style={{ marginRight: -40 }}>50,000,000</span>
          <span style={{ marginRight: -40 }}>100,000,000</span>
          <span style={{ marginRight: 60 }}>150,000,000</span>
          {/* {markPoints.map((item, index) => (
            <span key={index} style={{ marginRight: index === 3 ? 60 : -40 }}>
              {numberFormat(item)}
            </span>
          ))} */}
        </div>

        <div className={styles.horizontal}>
          <div className={styles["y-key"]}>
            {data.map(
              ({ CountryName, index }) =>
                CountryName !== "World" && (
                  <span
                    key={CountryName}
                    style={{
                      top: index * 10 + "%",
                    }}
                  >
                    {CountryName}
                  </span>
                )
            )}
          </div>
          <div className={styles["y-bar"]}>
            <div className={styles["line-break-point"]}>
              <div></div>
              {passedPoints.map((item, index) => (
                <div></div>
              ))}
            </div>

            {data.map(
              (item) =>
                item.CountryName !== "World" && (
                  <div
                    key={`${item.CountryName}`}
                    className={styles["bar-container"]}
                    style={{ top: item.index * 10 + "%" }}
                  >
                    <div
                      style={{
                        width:
                          (item.Population /
                            Math.max(
                              ...data
                                .filter((item) => item.CountryName !== "World")
                                .map((item) => item.Population)
                            )) *
                            100 +
                          "%",
                        background: continentBackgroundColor(item.continent),
                      }}
                    >
                      {flag(item.flag)}
                    </div>
                    {item.index <= 11 && (
                      <CountUp
                        start={
                          countStartByName(item.CountryName, year)?.Population
                        }
                        end={
                          countStartByName(item.CountryName, year + 1)
                            ?.Population
                        }
                        duration={1}
                      >
                        {({ countUpRef }) => <span ref={countUpRef}></span>}
                      </CountUp>
                    )}
                  </div>
                )
            )}
          </div>
          <CountUp
            start={countStartByName("World", year)?.Population}
            end={countStartByName("World", year + 1)?.Population}
            duration={1}
          >
            {({ countUpRef }) => (
              <div className={styles["total-number"]}>
                <span className={styles.year}>{year}</span>
                <div className={styles["total"]}>
                  <span>Total: </span>
                  <span ref={countUpRef}></span>
                </div>
              </div>
            )}
          </CountUp>
        </div>
      </div>
    </div>
  );
}
