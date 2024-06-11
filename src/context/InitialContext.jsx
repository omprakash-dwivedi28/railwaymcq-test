import React, { useEffect, useReducer, useContext } from "react";
import reducer from "./initial_reducer";

const initialState = {
  railwayInfo: { railway_zone: null, railway_division: null },
  zoneAndDivisionData: null,
  zoneAndDivisionLoading: false,
  zoneAndDivisionError: false,

  departmentData: null, // New state for department data
  departmentLoading: false, // New loading state for department data
  departmentError: false, // New error state for department data

  subjectData: null,
  subjectLoading: false,
  subjectError: false,

  adminloginData: null,
  adminloginLoading: false,
  adminloginError: false,
  // userloginData: "no user",
};

const InitialContext = React.createContext();

export const InitialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const zoneAndDivisionInfo = async () => {
    dispatch({ type: "GET_ZONE_AND_DIVISION_INFO_BEGIN" });
    try {
      const response = await fetch(
        "https://railwaymcq.com/ohe/zone_division_api.php"
      );
      const data = await response.json();

      dispatch({ type: "GET_ZONE_AND_DIVISION_INFO_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "GET_ZONE_AND_DIVISION_INFO_ERROR" });
    }
  };

  // New function to fetch department data
  const departmentInfo = async () => {
    dispatch({ type: "GET_DEPARTMENT_INFO_BEGIN" });
    try {
      const response = await fetch(
        "https://railwaymcq.com/student/deptt_api.php"
      );
      const data = await response.json();

      dispatch({ type: "GET_DEPARTMENT_INFO_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "GET_DEPARTMENT_INFO_ERROR" });
    }
  };
  // New function to fetch Subject data
  const subjectInfo = async () => {
    dispatch({ type: "GET_SUBJECT_INFO_BEGIN" });
    try {
      const response = await fetch(
        "https://railwaymcq.com/student/subject_api.php"
      );
      const data = await response.json();

      dispatch({ type: "GET_SUBJECT_INFO_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "GET_SUBJECT_INFO_ERROR" });
    }
  };

  const adminloginInfo = (data) => {
    dispatch({ type: "GET_ADMIN_DATA", payload: data });
  };
  // const userloginInfo = (data) => {
  //   dispatch({ type: "GET_USER_DATA", payload: data });
  // };

  const Logout = (usertype) => {
    dispatch({ type: "GET_LOGOUT_DATA", payload: usertype });
  };
  useEffect(() => {
    zoneAndDivisionInfo();
    departmentInfo();
    subjectInfo(); // Fetch department data when component mounts
    adminloginInfo();
  }, []);

  const SetZoneAndDivision = (value, type = "") => {
    if (type === "RAILWAY_ZONE") {
      dispatch({ type: "ZONE", payload: { value } });
    }
    if (type === "RAILWAY_DIVISION") {
      dispatch({ type: "DIVISION", payload: { value } });
    }
  };

  return (
    <InitialContext.Provider
      value={{
        ...state,
        zoneAndDivisionInfo,
        SetZoneAndDivision,
        departmentInfo,
        subjectInfo,
        adminloginInfo,
        Logout,
      }}
    >
      {children}
    </InitialContext.Provider>
  );
};
export const useInitialContext = () => {
  return useContext(InitialContext);
};
