import React, { Component } from 'react';
import Menu from './../components/Menu.js';
import '../styles/common.scss';
import '../styles/mission.scss';
import chicken from '../img/mission_chicken.jpg';
import aerial from '../img/info_aerial.jpg';
import truck from '../img/info_truck.jpg';

class Mission extends Component {
  render() {
    return (
      <article>
        <Menu current="mission"/>
        <h1 className="title">Mission - dev version!</h1>
        <span className="image main"><img src={aerial} alt="" /></span>
          <p>West Oakland is situated adjacent to the Port of Oakland,
          bounded by three major freeways (I-580, I-880, and I-980), and home to a
          major U.S. Postal Service Distribution Center. <i>West Oakland residents are
          exposed to high concentrations of diesel particulate matter—almost three
          times higher than the average background levels in the Bay Area—and that
          the largest source of risk (71%) is attributed to truck traffic</i>. Trucks
          remain the single highest sources of diesel emissions in West Oakland.
          Diesel-powered vehicles and equipment account for nearly half of all
          nitrogen oxides (NOx) and more than two-thirds of all particulate matter
          (PM) emissions from US transportation sources. </p>
          <span className="image main"><img src={truck} alt="" /></span>
          <p>Particulate matter or soot is created during the incomplete combustion
          of diesel fuel. Its composition often includes hundreds of chemical elements,
          including sulfates, ammonium, nitrates, elemental carbon, condensed organic
          compounds, and even carcinogenic compounds and heavy metals such as arsenic,
          selenium, cadmium and zinc. Though just a fraction of the width of a human
          hair, particulate matter varies in size from coarse particulates (less than
              10 microns in diameter) to fine particulates (less than 2.5 microns) to
          ultrafine particulates (less than 0.1 microns). Ultrafine particulates, which
          are small enough to penetrate the cells of the lungs, make up 80-95% of diesel
          soot pollution. </p>
          <p>Diesel exhaust has been classified a potential human carcinogen by the U.S.
          Environmental Protection Agency (EPA) and the International Agency for Research
          on Cancer. Exposure to high levels of diesel exhaust has been shown to cause
          lung tumors in rats, and studies of humans routinely exposed to diesel fumes
          indicate a greater risk of lung cancer. For example, occupational health studies
          of railroad, dock, trucking, and bus garage workers exposed to high levels of
          diesel exhaust over many years consistently demonstrate a 20 to 50 percent increase
          in the risk of lung cancer or mortality.</p>
          <span className="image main"><img src={chicken} alt="" /></span>
          <p>Our project intention is to empower all communities that suffer the impacts of trucking and the freight industry.
              Our truck traffic survey tool allows community residents to document truck traffic volumes and directions, and maps
              that data for later analysis and advocacy. Our mission is to give residents the tools and the power to get toxic truck
              emission off of their streets and out of their neighborhoods.</p>

          <p>The tools we create can be used to survey surface streets for estimated traffic volumes and routes of medium duty and
              heavy duty trucks along residential streets in West Oakland in order to improve the spatial representation of roadway
              emissions and differentiate the contribution of Port versus non-Port trucks. This data will aid residents who advocate
              for the control of medium heavy-duty (MHD) and heavy heavy-duty (HHD) truck traffic on residential streets of West Oakland,
                  enforce legal truck routes, identify the locations and duration of truck idling activity, and reduce the vehicle miles
              travelled for trucks within the study area.</p>
      </article>
    );
  }
}

export default Mission;
