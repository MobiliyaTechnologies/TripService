'use strict';
/**
 *  This module is use to define constants
 *  @module constants
 *  @author shweta.ghenand
 *  @version 1.0.0
 */

/**
 *  import project modules
 */
var constants = {};
/**
 *  constansts
 */

constants.order = ['asc', 'desc'];
constants.tripSortFields = ['tripName', 'startTime', 'endTime', 'startLocation', 'endLocation', 'vehicleId'];
constants.ruleTypes = ['Speed','Location'];
constants.tripStatus = [0, 1, 2];
constants.eff_rpm_1 = 700;
constants.eff_rpm_2 = 1200;
constants.eff_rpm_3 = 2500;
constants.eff_rpm_4 = 4000;
constants.algo_periodicity = 100;
constants.speedLimit = 100;
constants.exponent = 6;
constants.n_exp_brk = 6;
constants.n_exp_acc = 5;
constants.Released = 0;
constants.Pressed = 1;
constants.accln_coeff = [9.9896, 1.1267, -1.8288, -46.298, 97.013, -65.178, 12.177];
constants.acc_ped_normal_tresh = 25;
constants.acc_ped_moderate_tresh = 50;
constants.acc_ped_heavy_tresh = 75;
constants.high_spd_brk = 80;
constants.speedcount_normal_threshold = 0;
constants.speedcount_moderate_threshold = 3;
constants.speedcount_heavy_threshold = 5;
constants.brakingInstantaneouRating_normal_threshold = 10;
constants.brakingInstantaneouRating_moderate_threshold = 7;
constants.brakingInstantaneouRating_heavy_threshold = 4;
constants.hardBrakingcount_normal_threshold = 0;
constants.hardBrakingcount_moderate_threshold = 3;
constants.hardBrakingcount_heavy_threshold = 5;
constants.avg_eng_rpm_normal_threshold = 4098;
constants.avg_eng_rpm_moderate_threshold = 8193;
constants.avg_eng_rpm_heavy_threshold = 12288;
constants.minutes = 60;
constants.braking_rating=12.5;
constants.braking_normal_rating = 6.5;
constants.braking_moderate_rating = 4;
constants.braking_heavy_rating = 2;
constants.RPM_rating=12.5;
constants.RPM_normal_rating = 6.5;
constants.RPM_moderate_rating = 4;
constants.RPM_heavy_rating = 2;
constants.TimeandDistance_rating=12.5;
constants.TimeandDistance_normal_rating = 6.5;
constants.TimeandDistance_moderate_rating = 4;
constants.TimeandDistance_heavy_rating = 2;;
constants.acceleration_normal_rating = 25;
constants.acceleration_moderate_rating = 13;
constants.acceleration_heavy_rating = 8;
constants.acceleration_harsh_rating = 4;
constants.acceleration_no_rating = 0;
constants.speed_rating=25;
constants.speed_normal_rating = 13;
constants.speed_moderate_rating = 8;
constants.speed_heavy_rating = 4;






/**
 *  export module
 */
module.exports = constants;