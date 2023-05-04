/*
    convert between different timezones
*/
import moment from 'moment'

export const dayStartHourSaving = 17;
export const dayEndHourSaving = 17;

export const dayStartHour = 18;
export const dayEndHour = 18;

export const dayStartMin = 35;
export const dayStartSec = 50;

export const dayEndMin = 40;
export const dayEndSec = 50;

export const nightStartHourSaving = 2;
export const nightEndHourSaving = 2;

export const nightStartHour = 3;
export const nightEndHour = 3;


export const nightStartMin = 17;
export const nightStartSec = 50;

export const nightEndMin = 22;
export const nightEndSec = 50;



export function checkDayLightSaving(){
    Date.prototype.stdTimezoneOffset = function () {
        let jan = new Date(this.getFullYear(), 0, 1);
        let jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
      }
      
    Date.prototype.isDstObserved = function () {
          return this.getTimezoneOffset() < this.stdTimezoneOffset();
    } 
}


export function UTCToCentral(e){
    const centralMoment = moment(e).tz('America/Chicago');
    const centralIsoString = centralMoment.format("YYYY-MM-DD HH:mm:ss");
    return centralIsoString;
}

export function CentralToUTC(e){


}