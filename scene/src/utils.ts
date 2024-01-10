import { Entity } from "@dcl/sdk/ecs";
import { Logger, LoggerLevel } from "./logging";

const logger = new Logger("utils.", {});

//export function removeFromEngine(entity: Entity) {
  //console.log("removeFromEngine for ",entity,"ignoring right now since no way to just add back, need new way to add remove or dont")
  //engine.removeEntity(entity);
//}
export function notNull(obj: any): boolean {
  return obj !== null && obj !== undefined;
}
export function isNull(obj: any): boolean {
  return obj === null || obj === undefined;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomChar(): string {
  return characters.charAt(Math.floor(Math.random() * characters.length))
}
export function generateGUID(size:number): string {
  return ([...Array(size)].map(() => randomChar()).join(''))
}

export function convertDateToYMDHMS(date:Date) {
  var d = date.getDate();
  var m = date.getMonth() + 1; //Month from 0 to 11
  var y = date.getFullYear();

  //return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  //2022-10-04T02:52:13.408Z => 2022-10-04 02:52:13
  console.log("convertDateToYMDHMS",date.toISOString())

  return date.toISOString().split("T").join(" ").split("\.")[0] + " UTC"
}


export function concatString(strArr: string[], theDefault: string) {
  let str = "";
  for (const p in strArr) {
    str += notNull(strArr[p]) ? strArr[p] : theDefault;
  }
  return str;
}

export function pushStrToArr(
  dailyLeaderArrStr: string[],
  label: string,
  value?: string | number,
  theDefault?: string
) {
  if (notNull(value)) {
    dailyLeaderArrStr.push(label + " " + value);
  } else {
    dailyLeaderArrStr.push(label + " " + theDefault);
  }
}

//TODO move this someone else
export function strLPad(text: string, pad: string, amount: number, rtrail: string) {
  let str = text;

  for (let x = str.length + rtrail.length; x < amount; x++) {
    str = pad + str;
  }

  str += rtrail;

  return str;
}