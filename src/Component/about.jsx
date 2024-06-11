import React, { useState } from "react";
// import AdminPage from "./AdminPage";
export default function About() {
  const [mybtnText, setbtnText] = useState("Enable Dark Mode");

  const [myStyle, setMyStyle] = useState({
    color: "black",
    backgroundColor: "white",
    border: "1px solid white",
  });

  const toggleStyle = () => {
    if (myStyle.color === "white") {
      setMyStyle({
        color: "black",
        backgroundColor: "white",
        border: "1px solid white",
      });
      setbtnText("Enable Dark mode");
    } else {
      setMyStyle({
        color: "white",
        backgroundColor: "black",
      });
      setbtnText("Enable Light mode");
    }
  };

  return (
    <div className="container" style={myStyle}>
      {/* <AdminPage></AdminPage> */}
      <div className="mx-10">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDefault"
            onChange={toggleStyle}
          />
          <label className="form-check-label" for="flexSwitchCheckDefault">
            {mybtnText}
          </label>
        </div>
      </div>

      <h2 className="my-3" style={myStyle}>
        About us
      </h2>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
              style={myStyle}
            >
              TRD(TRACTION DISTRIBUTION)
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body" style={myStyle}>
              <strong>TRACTION DISTRIBUTION.</strong> What is electrical TrD in
              railway work? Westran central Railway TRACTION DISTRIBUTION
              DEPARTMENT of JABALPUR DIVISION is responsible for maintenance &
              operation of Overhead equipment's, Power supply installations,
              Substation Installations & remote control to supply necessary
              electric power to Electric Locomotive/EMU in the jurisdiction of
              JABALPUR Division of Westran central Railway.{" "}
              <code>.accordion-body</code>, though the transition does limit
              overflow.
            </div>
          </div>
        </div>
        <div className="accordion-item" style={myStyle}>
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
              style={myStyle}
            >
              OHE
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body" style={myStyle}>
              <strong>Over Head Equipment</strong> Over Head Equipment (OHE): A
              simple polygonal type of overhead equipment comprises of a single
              65 sq. mm. size Catenary wire of Cadmium Copper and a hard drawn
              grooved copper Contact wire of 107 sq. mm. size suspended from the
              Catenary by 5 mm dia copper dropper wire spaced 9 meters apart.
              The OHE is supported by swiveling type Cantilever bracket
              assembly. A tension of 1000 kgs is given in each conductor i.e.,
              Catenary and Contact wire. This tension is kept constant,
              automatically compensating the variations in conductor length due
              to change in temperature through the regulating equipment erected
              at the termination of conductors, also known as Automatic
              Tensioning Device. The Catenary wire comprises 19 strands of
              cadmium copper, each strand of 2.10 mm dia, with overall dia of
              10.5 mm having about 80% conductivity and 65 sq. mm
              cross-sectional area. The contact wire is a solid hard drawn
              grooved electrolytic. copper of 12.24 mm dia and 107 sq. mm
              cross-sectional area. The total current carrying capacity of both
              wires is 600 Amps. The condemning size of contact wire is 8.25 mm.
              The OHE span varies between 72 Meters and 27 Meters with a step of
              4.5 M. The maximum span of 72 M is adopted on the section having
              wind pressure of 112.5 kgs/ M2 and 75 kgs/M2 only. The span is
              reduced on curvature depending upon the degree of curvature. As a
              standard practice, an independent mast is used to support the OHE
              for each track to obtain mechanical independence Steel masts are
              of Four types BFB (Broad Over Head Equipments Flanged Beam) RSJ
              (Rolled Steel Joist) the fabricated rectangular sectional mast of
              K and B type. Portals are also used to serve multiple track
              section where space between two tracks to locate an independent
              mast is not adequate. There are three types of Portals in use
              i.e., N, O & R type. P, G, and double BFB type uprights are used
              where track separation is less. All Masts & Portals are galvanized
              before installation.Traction Mast / Portals are embedded in the
              concrete foundation. There are the different type of foundations
              which are used according to soil pressure and location. The five
              standard types of foundations mostly used are : Side Bearing Side
              gravity New Pure gravity Wet Black cotton soil Dry Black Cotton
              Soil A presage of 100 mm is provided on the contact wire for the
              maximum span of 72 meters and proportionately reduced for lesser
              spans. Regulated OHE with 100 mm presage is considered suitable
              for 160 Kmph speed operation. The contact wire is staggered at
              support so that as the pantograph glides along the contact wire,
              the contact wire sweeps to and fro across the bearing surface of
              the pantograph span up to a distance of 200 mm on either side of
              the centre line of pan on tangent track and 300 mm on curved
              tracks towards the outer side. This ensures uniform wear of the
              steel strips of the pantograph. The electrical clearance between
              live part, and earthed part i.e. fixed structures or moving load
              shall be maintained normally as large as possible. The minimum
              clearance under worst condition of temperature, winds etc are
              given below: Minimum Vertical distance for: Long duration – 250 mm
              Short duration – 200 mm Minimum horizontal distance for: Long
              duration – 250 mm Short duration – 200 mm The OHE conductors are
              terminated at intervals of 1.5 kilometers and suitably anchored.
              The changeover is made by overlapping the conductors, normally on
              3 spans. The conductor’s height at support is so adjusted that the
              conductors are physically clear from any obstruction under all
              conditions as well as the pantograph glides over from one
              conductor to another smoothly without any spark. There are two
              types of overlap: Uninsulated Overlap: In this type of overlap,
              the distance between two conductors is kept 200 mm and the
              conductors are permanently connected by jumpers to have electrical
              continuity. Insulated Overlap In this case, the two OHE conductors
              are kept apart at a distance of 500 mm. The electrical continuity
              at the insulated overlap is bridged by Interrupters or Isolating
              Switches except at Neutral Section (SP).In regulated OHE, to
              ensure uniform distribution of the mechanical tension in the OHE
              conductors, an anti-creep point is installed at the midpoint of
              the tension length of OHE conductor. Section Insulators are
              provided to insulate the OHE of one track and another track, such
              as at turnouts & crossover, and to separate secondary tracks and
              sidings from the main line or other sidings.When the pantograph of
              a locomotive passes from one track to another along a crossover,
              current collection changes from one OHE to another. The runners do
              have the overlap so that there may not be any sparking during the
              changeover.Solid core Porcelain Insulators are used to support the
              OHE as Bracket and Stay arm Insulators. For termination, 9 ton
              insulators are used. CONTACT WIRE HEIGHT: Over Line, Structure to
              permit C class ODC – 4.92 M Electric Loco Shed and Inspection Pits
              – 5.80 M Level Crossing – 5.50 M Unregulated OHE Temperature 4°C
              to 65° C – 5.75 M Temperature 15°C to 65°C – 5.65 M Regulated OHE
              with 50 mm Sag – 5.55 M Regulated OHE with 100 mm Sag – 5.60 M
              Height of the Rail Gauge at level crossing – 4.67 M TRACTION
              SUBSTATION (TSS): Every TSS has 2 nos. traction transformers out
              of which one is working at a time and the second transformer is
              standby. The capacity of each traction transformer is sufficient
              to feed its own feed zone and half of the adjoining feed zone.
              Feeding Post (FP): To feed 25 KV traction power to OHE. The
              section of OHE normally fed by a traction transformer. Feed
              Length: The distance for which a traction transformer will feed
              power in emergent conditions i.e., the distance between two
              adjoining FPs. Over Head equipment (OHE): A system of conductors /
              equipment carrying traction power from traction substation to
              electric locomotive. Neutral Section (NS): To separate OHE of two
              adjoining feed posts. A short neutral section (PTFE) type is
              provided opposite the Traction Sub Station to avoid the need of
              lowering the pantograph during extended feed conditions.
              Sectioning Post (SP): To facilitate the extension of traction
              power from one feed zone to half of the adjoining feed zone during
              an emergency. Parallel the UP and DN OHE in double the sections.
              Sub-sectioning and paralleling post (SSP): To sectionalize OHE. To
              parallel the UP and DN OHE in double line sections. Sector: The
              section of the OHE between the FP & SP is called the sector.
              Sub-Sector: The section of the OHE between the FP & SSP, SSP & SP
              is called sub-sector. This is the shortest section of the OHE
              which can be isolated through Remote Control by the Traction Power
              Controller. Elementary Section (ES): This is the shortest section
              of the OHE which can be isolated manually for carrying out OHE
              maintenance work. <code>.accordion-body</code>, though the
              transition does limit overflow.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
              style={myStyle}
            >
              PSI
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body" style={myStyle}>
              <strong>About PSI</strong> It is Power Supply Installation (PSI)
              provides power to Over Head Equipment (OHE) to cater power to
              electric locomotives & EMUs. PSI comprises lot of electrical
              equipment in Traction Sub Stations (TSS), Sub Sectioning Post
              (SSP), and Sectioning Post (SP) with their associated fittings,
              insulators and other attachments. <code>Learner</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
