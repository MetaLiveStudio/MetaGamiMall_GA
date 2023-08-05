import format from "./string-template/stringTemplate"
import i18next from "./i18next/i18next"
import { namespaces } from "./i18n.constants";
import { languages } from "./i18n.constants";
import { es, en, tr, de, it, sa, zh, ko, jp, br, ir } from "./i18n.translations";

const greeting = format("Hello {0}, you have {1} unread messages", ["Robert", 12])
const greeting2 = format("Hello {name}, you have {num} unread messages", {
    name: "will", num: 12
})

/*
const createI18n = (language: string): i18nInstance => {
    const i18n = i18next.createInstance()
  
    i18n.init({
      lng: language,
      fallbackLng: language,
      resources: {
        [languages.es]: es,
        [languages.en]: en,
      },
    });
  
    return i18n;
  };
  
export const i18n = createI18n(languages.es);
*/
  
const language = languages.en
i18next.init({
    lng: language,
    ns: [namespaces.common,namespaces.pages.hello,namespaces.ui.staminaPanel],
    //fallbackLng: languages.en,
    //defaultNS: namespaces.pages.hello,
    fallbackNS: namespaces.common,
    resources: {
      [languages.en]: en,
      [languages.es]: es,
      [languages.tr]: tr,
      [languages.de]: de,
      [languages.it]: it,
      [languages.sa]: sa,
      [languages.zh]: zh,
      [languages.ko]: ko,
      [languages.jp]: jp,
      [languages.br]: br,
      [languages.ir]: ir,

    },
    /*lng: 'en', // if you're using a language detector, do not define the lng option
    debug: false,
    resources: {
        en: {
            translation: {
                "key": "hello world"
            },
            common: {
                "cancel": "cccccc"
            }
        }
    }*/
})

const greeting11 = format("Hello {0}, you have {1} unread messages", ["Robert", 12])
const greeting22 = format("Hello {name}, you have {num} unread messages", {
    name: "will", num: 12
})

i18next.t("welcome")
log("i18n",i18next.t("key", { what: 'i18next', how: 'great' }))
log("i18n",i18next.t("welcome",{ns:namespaces.pages.hello}))
log("i18n",i18next.t("dailyCap.notMet",{currentValue:1,maxValue:10,remainingValue:2,currentPercent:20},{ns:namespaces.ui.staminaPanel}))
log("i18n",i18next.t("dailyCap.notMet",{currentValue:1,maxValue:10,remainingValue:2,currentPercent:20},{ns:namespaces.ui.staminaPanel}))
log("i18n",i18next.t("dailyCap.test",{ns:namespaces.ui.staminaPanel}))
log("i18n",i18next.t("button.cancel"))
log("i18n",i18next.t("look.deep"))
log("i18n",i18next.t("deep.look"))
log("i18n",i18next.t("deep.look",{ns:namespaces.ui.staminaPanel}))
log("i18n",i18next.t("deep.look2"))

export const i18n = i18next

const langChangeListeners:((lng:string)=>void)[] = []
const langChangeListenersById:Record<string,((lng:string)=>void)> = {}

/**
 * register a callback to be called when the language changes
 * @param callback function to be called on language change
 */
export function i18nOnLanguageChangedAdd(callback:(lng:string)=>void){
    log("i18n","i18nOnLanguageChangedAdd","callback",callback)
    langChangeListeners.push(callback)
}
export function i18nOnLanguageChangedAddReplace(id:string,callback:(lng:string)=>void){
    const old = langChangeListenersById[id]
    langChangeListenersById[id] = callback
    log("i18n","i18nOnLanguageChangedAddReplace","id",id,"callback",callback,"old",old)
}
i18n.on('languageChanged', function(lng:string) {
    log("i18n","languageChanged",lng,"i18n.language",i18n.language)
    //notify all listeners
    for(const fn of langChangeListeners){
        log("i18n","languageChanged","langChangeListeners calling listener",fn)
        fn(lng)
    }
    for(const id in langChangeListenersById){
        const fn = langChangeListenersById[id]
        log("i18n","languageChanged","langChangeListenersById calling listener",fn)
        fn(lng)
    }
})