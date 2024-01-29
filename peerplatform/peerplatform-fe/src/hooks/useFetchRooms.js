import { useCallback } from "react";
//callback allows us to fetch the list of rooms from the API
//we return a promise that resolves with the list of rooms if the fetch is successful
export const useFetchRooms = (url) => {
  const fetchRooms = useCallback(() => {
    console.log("fetchRoom running");
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.rooms);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [url]);
  return fetchRooms;
};
