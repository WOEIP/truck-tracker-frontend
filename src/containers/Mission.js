import React, { Component } from 'react';
import chicken from '../img/mission_chicken.jpg';
import truck from '../img/info_truck.jpg';

class Mission extends Component {
  render() {
    return (
        <article id="mission">
        <h2 className="major">Mission</h2>
        <span className="image main"><img src={chicken} alt="" /></span>
      <p>West Oakland is situated adjacent to the Port of Oakland,
      bounded by three major freeways (I-580, I-880, and I-980),
      and home to a major U.S. Postal Service Distribution Center.
        West Oakland residents are exposed to high concentrations of diesel
      particulate matter—almost three times higher than the average
      background levels in the Bay Area—and that the largest source of
      risk (71%) is attributed to truck traffic.</p>
        <span className="image main"><img src={truck} alt="" /></span>
        <p>Trucks remain the single highest sources of diesel emissions
        in West Oakland.Diesel-powered vehicles and equipment account for
          nearly half of all nitrogen oxides (NOx) and more than two-thirds
      of all particulate matter (PM) emissions from US transportation sources. </p>
        <p>Particulate matter or soot is created during the incomplete
      combustion of diesel fuel. Its composition often includes hundreds
      of chemical elements, including sulfates, ammonium, nitrates,
      elemental carbon, condensed organic compounds, and even carcinogenic
      compounds and heavy metals such as arsenic, selenium, cadmium and zinc.
        hough just a fraction of the width of a human hair, particulate matter
      varies in size from coarse particulates (less than 10 microns in diameter)
      to fine particulates (less than 2.5 microns) to ultrafine particulates
      (less than 0.1 microns). Ultrafine particulates, which are small enough
      to penetrate the cells of the lungs, make up 80-95% of diesel soot
      pollution.</p>
        <p>Diesel exhaust has been classified a potential human carcinogen
      by the U.S. Environmental Protection Agency (EPA) and the International
      gency for Research on Cancer. Exposure to high levels of diesel exhaust
      has been shown to cause lung tumors in rats, and studies of humans
      routinely exposed to diesel fumes indicate a greater risk of lung
      cancer. For example, occupational health studies of railroad, dock,
      trucking, and bus garage workers exposed to high levels of diesel
      exhaust over many years consistently demonstrate a 20 to 50 percent
      increase in the risk of lung cancer or mortality.</p>
        <p>Our mission is to survey surface streets and estimate traffic
      volumes and routes of medium heavy duty and heavy heavy duty trucks along
      residential streets in West Oakland in order to improve the
      spatial representation of roadway emissions and differentiate
      the contribution of Port versus non-Port trucks. In turn will
      reduce the following: the volume of medium heavy-duty (MHD)
      and heavy heavy-duty (HHD) truck traffic on the residential streets
      of West Oakland, the primary routes of truck travel, the locations
      and duration of truck idling activity, and the vehicle miles
      travelled for trucks within the study area.</p>
        </article>
    );
  }
}

export default Mission;
