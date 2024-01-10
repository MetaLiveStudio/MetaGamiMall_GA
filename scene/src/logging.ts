export type LoggerLevel = "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE" | "LOG";

const LOGGING_LEVEL_NUMS: Record<string, number> = {};
LOGGING_LEVEL_NUMS["LOG"] = 0; //made up level to ensure logged no matter what
LOGGING_LEVEL_NUMS["ERROR"] = 1;
LOGGING_LEVEL_NUMS["WARN"] = 2;
LOGGING_LEVEL_NUMS["INFO"] = 3;
LOGGING_LEVEL_NUMS["DEBUG"] = 4;
LOGGING_LEVEL_NUMS["TRACE"] = 5;

interface LoggerConf {
  level: LoggerLevel;
}

export const LOGGING_CONF: LoggerConf = {
  level: "DEBUG",
};

export type LoggerContextData = {
  channelId?: string;
  userId?: string;
  displayName?: string;
};

export function logChangeListenerEntry(
  method: string,
  key: string,
  newVal: any,
  oldVal: any
) {
  //short circuit for very chatter events like
  if (key == "countDownTimerValue") {
    return;
  }
  console.log(method, key, " ", newVal, " ", oldVal);
}

export class Logger {
  name: string;
  contextData: LoggerContextData;

  constructor(name: string, contextData: LoggerContextData) {
    this.name = name;
    this.contextData = contextData;
  }

  //2021-03-16 13:58:10.817  INFO [traceid= spanid= parentspanid=] 58189 --- [           main] c.c.c.ConfigServicePropertySourceLocator : Fetching config from server at : http://localhost:8888
  trace(method: string, msg: string, args: any) {
    this.logIt("TRACE", method, msg, args);
  }
  info(method: string, msg: string, args: any) {
    this.logIt("INFO", method, msg, args);
  }
  log(method: string, msg: string, args: any) {
    this.logIt("LOG", method, msg, args);
  }
  debug(method: string, msg: string, args: any) {
    this.logIt("DEBUG", method, msg, args);
  }
  warn(method: string, msg: string, args: any) {
    this.logIt("WARN", method, msg, args);
  }
  logIt(level: LoggerLevel, method: string, msg: string, args: any) {
    let argsStr = null;
    if (args) {
      argsStr = args;
    }
    let contextStr = "";
    if (this.contextData) {
      contextStr += " [";
      if (this.contextData.channelId) contextStr += this.contextData.channelId;
      contextStr += "]";
    }

    console.log(
      level +
        contextStr +
        " " +
        this.name +
        " " +
        method +
        ": " +
        msg +
        " " +
        argsStr
    );
  }

  isWarnEnabled() {
    return LOGGING_LEVEL_NUMS["WARN"] <= LOGGING_LEVEL_NUMS[LOGGING_CONF.level];
  }
  isDebugEnabled() {
    return (
      LOGGING_LEVEL_NUMS["DEBUG"] <= LOGGING_LEVEL_NUMS[LOGGING_CONF.level]
    );
  }
  isInfoEnabled() {
    return LOGGING_LEVEL_NUMS["INFO"] <= LOGGING_LEVEL_NUMS[LOGGING_CONF.level];
  }
  isTraceEnabled() {
    return (
      LOGGING_LEVEL_NUMS["TRACE"] <= LOGGING_LEVEL_NUMS[LOGGING_CONF.level]
    );
  }
}
