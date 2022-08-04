/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { stamenToner } from "pigeon-maps/providers";
import debounce from "lodash.debounce";
import { DebounceInput } from "react-debounce-input";

type Result = any | null;
type Results = Result[];

function getDevicePixelRatio() {
  return window.devicePixelRatio || 1;
}

const Home: NextPage = () => {
  const [foodQuery, setFoodQuery] = useState("");
  const [results, setResults] = useState<Results>([]);
  const [haveMoved, setHaveMoved] = useState(false);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(15);
  const [location, setLocation] = useState<[number, number]>([10, 10]);
  const [locationQuery, setLocationQuery] = useState("");
  const [dprs, setDprs] = useState<number>(1);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((e) => {
        setLocation([e.coords.latitude, e.coords.longitude]);
        setCenter([e.coords.latitude, e.coords.longitude]);
        search(`${e.coords.latitude}, ${e.coords.longitude}`, foodQuery);
      });
    } else {
      setLocation([40.7812, -73.9665]);
      search("40.7812, -73.9665", foodQuery);
    }
  }, []);

  function search(locationStr: string, foodStr: string) {
    fetch(
      `/api/search-area?q=${foodStr || "food"}&l=${
        locationStr || location[0] + "," + location[1]
      }`
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setResults(res.businesses);
        setLocation([res.region.center.latitude, res.region.center.longitude]);
        setCenter([res.region.center.latitude, res.region.center.longitude]);
        setZoom(16);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSelectLocation({
    event,
    latLng,
  }: {
    event: MouseEvent;
    latLng: [number, number];
  }) {
    setCenter(latLng);
    setLocation(latLng);
    setHaveMoved(false);
  }

  function handleMarkerClick({
    event,
    anchor,
  }: {
    event: MouseEvent;
    anchor: [number, number];
  }) {
    setCenter(anchor);
    //setLocation(anchor)
    setHaveMoved(true);
    setZoom(14);
  }

  return (
    <>
      <Head>
        <title>Where Should I Eat?</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-full w-full flex-col items-center justify-center border-2 border-black">
        {/*WHERE*/}
        <div className="z-1 relative h-screen w-full">
          <Map
            //provider={stamenToner}
            metaWheelZoom={true}
            defaultCenter={[40.7812, -73.9665]}
            center={center}
            //@ts-expect-error
            metaWheelZoomWarning={null}
            maxZoom={14}
            onClick={handleSelectLocation}
            onBoundsChanged={({ center, zoom }) => {
              setCenter(center);
              setHaveMoved(true);
            }}
          >
            <ZoomControl />
            <Marker width={50} anchor={location} onClick={handleMarkerClick} />
          </Map>

          <div className="absolute top-0 z-20 flex w-full flex-col items-center  justify-center text-lg ">
            <div className="mt-20 flex w-5/6 flex-col items-center justify-center gap-2 rounded-2xl bg-stone-800 p-4 lg:w-1/2">
              <h2 className="w-5/6 text-white">
                <b className="italic">Where</b> do you want to eat?
              </h2>
              <DebounceInput
                className="w-5/6 rounded-2xl border-2 border-black p-2"
                value={locationQuery}
                placeholder="Downtown Austin"
                debounceTimeout={200}
                onChange={(e) => [
                  setLocationQuery(e.target.value),
                  search(e.target.value, foodQuery),
                ]}
              />
            </div>
          </div>
        </div>
        {/*WHAT*/}
        <div className="flex h-screen w-full flex-col items-center justify-start border-2 bg-red-300 text-lg">
          <div className="mt-20 flex w-5/6 flex-col items-center justify-center gap-2 rounded-2xl bg-stone-800 p-4 lg:w-1/2">
            <h2 className="w-5/6 text-white">
              <b className="italic">What</b> do you want to eat?
            </h2>
            <DebounceInput
              className="w-5/6 rounded-2xl border-2 border-black p-2"
              value={foodQuery}
              placeholder="Pizza"
              debounceTimeout={200}
              onChange={(e) => [
                setFoodQuery(e.target.value),
                search(locationQuery, e.target.value),
              ]}
            />
          </div>
        </div>
        {/*TINDER*/}
        <div className="z-1 h-screen w-full bg-red-300">
          <div className="flex-reverse-col relative flex w-full items-center justify-center bg-white ">
            {results &&
              results.map((datum: any, idx: number) => {
                return (
                  <div
                    style={{
                      top: Math.min(idx, 3) * 10,
                      zIndex: 3 + 1 - idx,
                    }}
                    className="absolute flex aspect-[0.7143] w-96 flex-col items-center justify-start gap-4 rounded-2xl border-2 border-white bg-stone-800 p-2 text-white"
                    key={datum.id}
                  >
                    <div className="relative flex w-full flex-col items-center justify-start ">
                      <img
                        className="aspect-square w-full rounded-2xl object-cover"
                        src={datum.image_url}
                        alt={datum.name}
                      />
                      <div className="absolute bottom-0 right-0 h-3/4  w-full rounded-2xl bg-gradient-to-t from-stone-900"></div>
                      <div className="absolute bottom-0  right-0  flex w-full flex-col justify-start p-4 text-left">
                        <p className="gap-2 align-middle">
                          <b className="font-bold text-lg">{datum.name}</b>&nbsp;&nbsp;
                          <i className="font-light">{datum.price}</i>
                        </p>
                        <p className=""> 
                          {Math.round((datum.distance / 1609) * 100) / 100}{" "}
                          miles away
                        </p >
                        <p  className="">{datum.rating} Stars</p>
                      </div>
                    </div>
                    <button
                      className=""
                      onClick={() =>
                        setResults((p) => p.filter((e) => e.id !== datum.id))
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
