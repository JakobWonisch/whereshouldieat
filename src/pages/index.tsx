/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { stamenToner } from "pigeon-maps/providers";
import debounce from "lodash.debounce";
import { DebounceInput } from "react-debounce-input";
import FoodIcons from "../components/FoodIcons";
import StarRatings from "react-star-ratings";
import Link from "next/link";

function tiler(x: number, y: number, z: number, dpr?: number) {
  return `https://a.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png`;
}

type Result = any | null;
type Results = Result[];

const Home: NextPage = () => {
  const maxZoom = 14;

  const [toggle, setToggle] = useState(true);
  const [tab, setTab] = useState(0);
  const [foodQuery, setFoodQuery] = useState("");
  const [results, setResults] = useState<Results>([]);
  const [haveMoved, setHaveMoved] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(maxZoom);
  const [location, setLocation] = useState<[number, number]>([
    40.7812, -73.9665,
  ]);
  const [locationQuery, setLocationQuery] = useState("");
  const [dprs, setDprs] = useState<number>(1);

  useEffect(() => {
    if (!locationQuery) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((e) => {
          setLocation([e.coords.latitude, e.coords.longitude]);
          setCenter([e.coords.latitude, e.coords.longitude]);
          search(`${e.coords.latitude}, ${e.coords.longitude}`, "");
        });
      } else {
        setLocation([40.7812, -73.9665]);
        setCenter([40.7812, -73.9665]);
        search("40.7812, -73.9665", "");
      }
    }
  }, []);

  useEffect(() => {
    if (!firstLoad) {
      search(locationQuery, foodQuery);
    }
    setFirstLoad(false);
  }, [locationQuery, foodQuery]);

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
        setZoom(maxZoom);
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
    setZoom(maxZoom);
  }

  return (
    <>
      <Head>
        <title>Where Should I Eat?</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{ backgroundBlendMode: toggle ? "darken" : "" }}
        className="relative flex h-full w-full flex-col items-center justify-center  bg-stone-700"
      >
        {/*TINDER*/}
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <div className="flex h-screen w-full items-center justify-center ">
            {
              <Map
                provider={tiler}
                center={
                  results && results[0]
                    ? [
                        results[0].coordinates.latitude,
                        results[0].coordinates.longitude,
                      ]
                    : center
                }
                zoom={zoom}
                maxZoom={maxZoom + 3}
                onClick={handleSelectLocation}
                onBoundsChanged={({ center, zoom }) => {
                  setZoom(zoom);
                  setCenter(center);
                  setHaveMoved(true);
                }}
              >
                {results &&
                  results.map((result) => (
                    <Marker
                      key={result.id}
                      width={50}
                      anchor={[
                        result.coordinates.latitude,
                        result.coordinates.longitude,
                      ]}
                      onClick={handleMarkerClick}
                    />
                  ))}
              </Map>
            }
          </div>
          {results && !toggle && results[0] ? (
            [results[0]].map((datum: any, idx: number) => {
              return (
                <div
                  className="z-20 -mt-80 flex h-full w-full flex-col items-center justify-start gap-4 rounded-2xl bg-stone-200 p-2 text-stone-900 lg:absolute lg:top-20 lg:left-20  lg:mt-0 lg:h-screen lg:w-1/4"
                  key={datum.id}
                >
                  <div className="relative m-4 flex w-5/6 flex-col items-center justify-start md:w-1/2 lg:w-full">
                    <img
                      className="aspect-square w-full rounded-2xl object-cover"
                      src={datum.image_url}
                      alt={datum.name}
                    />
                    <div className="absolute bottom-0 right-0 h-3/4  w-full rounded-2xl bg-gradient-to-t from-stone-900"></div>
                    <div className="absolute bottom-0 right-0  flex  w-full flex-col justify-start p-4 text-left text-white">
                      <p className="gap-2 align-middle">
                        <b className="text-lg font-bold">{datum.name}</b>
                        &nbsp;&nbsp;
                        <i className="font-light">{datum.price}</i>
                      </p>
                      <p className="">
                        {Math.round((datum.distance / 1609) * 100) / 100} miles
                        away
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="h-8 flex items-center justify-center gap-2 align-center">
                          <StarRatings
                          
                            rating={datum.rating}
                            starRatedColor="gold"
                            starEmptyColor="black"
                            starDimension={"25px"}
                            numberOfStars={5}
                            name="rating"
                          />{" "}
                          ({datum.review_count})
                        </p>
                        <Link href={datum.url}>
                          <a rel="noreferrer noopener" target="_blank">
                            <img
                              className="h-8 rounded-lg bg-white p-0.5"
                              src={"yelp.svg"}
                            />
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 lg:w-full">
                    <p className="italic">
                      {datum.categories.map((c: any) => c.title).join(" | ")}
                    </p>
                    <p>{datum.display_phone}</p>
                    <p>{datum.location.display_address.join("\n")}</p>
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
            })
          ) : (
            <button
              className="z-20 my-10 -mt-40 flex h-20 w-full items-center justify-center rounded-2xl bg-stone-500 p-4 text-white lg:absolute lg:top-20 lg:left-20 lg:mt-0 lg:w-1/4"
              onClick={() => (setToggle(true), setTab(1))}
            >
              Try Again?
            </button>
          )}

          <button
            className="my-10 flex h-10 items-center justify-center rounded-2xl bg-stone-500 p-4 text-white"
            onClick={() => (setTab(1), setToggle(true))}
          >
            Change up your search
          </button>
          <div
            style={{ display: toggle ? "block" : "none" }}
            className="absolute h-full w-full bg-stone-800 bg-opacity-50"
          ></div>
        </div>

        {/*MDOAL */}
        <div
          style={{ display: toggle ? "block" : "none" }}
          className="absolute top-0 z-20 h-screen w-full bg-stone-50 md:top-20 md:h-3/4 md:w-3/4 md:rounded-2xl"
        >
          {/*WHERE*/}
          {tab == 0 && (
            <div className="relative flex h-full w-full flex-col items-center justify-start text-lg">
              <div className="h-1/2 w-full">
                <Map
                  provider={tiler}
                  center={center}
                  zoom={zoom}
                  maxZoom={maxZoom + 3}
                  onClick={handleSelectLocation}
                  onBoundsChanged={({ center, zoom }) => {
                    setZoom(zoom);
                    setCenter(center);
                    setHaveMoved(true);
                  }}
                >
                  <ZoomControl />
                  <Marker
                    width={50}
                    anchor={location}
                    onClick={handleMarkerClick}
                  />
                </Map>
              </div>
              <div className="flex h-1/4 w-full flex-col items-center justify-center gap-4 p-4 py-8">
                <h2 className="w-5/6 text-xl text-black">
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
              <button
                className="absolute bottom-5 right-5 h-1/4"
                onClick={() => setTab((p) => p + 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
          {/*WHAT*/}
          {tab == 1 && (
            <div className="relative flex h-full w-full flex-col items-center justify-center">
              <div className="z-10 flex h-full w-full flex-col items-center justify-start text-lg">
                <div className="h-1/2 w-full">
                  <FoodIcons
                    setToggle={setToggle}
                    setFoodQuery={setFoodQuery}
                  />
                </div>
                <div className="flex h-1/4 w-full flex-col items-center justify-center gap-4 p-4 py-8">
                  <h2 className="w-5/6 text-xl text-black">
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
                <button
                  className="absolute bottom-5 left-5 h-1/4"
                  onClick={() => setTab(0)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="absolute bottom-5 right-5 h-1/4"
                  onClick={() => (setTab(0), setToggle(false))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
