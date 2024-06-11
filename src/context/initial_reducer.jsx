const initial_reducer = (state, action) => {
  if (action.type === "GET_ZONE_AND_DIVISION_INFO_BEGIN") {
    return { ...state, zoneAndDivisionLoading: true };
  } else if (action.type === "GET_ZONE_AND_DIVISION_INFO_SUCCESS") {
    return {
      ...state,
      zoneAndDivisionLoading: false,
      zoneAndDivisionData: action.payload,
    };
  } else if (action.type === "GET_ZONE_AND_DIVISION_INFO_ERROR") {
    return {
      ...state,
      zoneAndDivisionLoading: false,
      zoneAndDivisionError: true,
    };
  } else if (action.type === "GET_DEPARTMENT_INFO_BEGIN") {
    return { ...state, departmentLoading: true };
  } else if (action.type === "GET_DEPARTMENT_INFO_SUCCESS") {
    return {
      ...state,
      departmentLoading: false,
      departmentData: action.payload,
    };
  } else if (action.type === "GET_SUBJECT_INFO_BEGIN") {
    return { ...state, subjectLoading: true };
  } else if (action.type === "GET_SUBJECT_INFO_SUCCESS") {
    return {
      ...state,
      subjectLoading: false,
      subjectData: action.payload,
    };
  } else if (action.type === "GET_ADMIN_DATA") {
    return { ...state, adminloginData: action.payload };
  } else if (action.type === "GET_LOGOUT_DATA") {
    if (action.payload === "admin" || action.payload === "user") {
      return { ...state, adminloginData: null };
    }
    // if (action.payload === "user") {
    //   return { ...state, userloginData: null };
    // }
  } else if (action.type === "GET_DEPARTMENT_INFO_ERROR") {
    return { ...state, departmentLoading: false, departmentError: true };
  } else if (action.type === "ZONE") {
    const ZONE = action.payload.value;
    return {
      ...state,
      railwayInfo: {
        ...state.railwayInfo,
        railway_zone: ZONE,
        railway_division: null,
      },
    };
  } else if (action.type === "DIVISION") {
    const DIVISION = action.payload.value;
    return {
      ...state,
      railwayInfo: { ...state.railwayInfo, railway_division: DIVISION },
    };
  } else {
    throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default initial_reducer;
