export const DEMOGRAPHICS_NOTICE_VERSION = "demographics-collection-v1"
export const ETHNICITY_STANDARD_VERSION = "Stats NZ 2023 Census ethnicity question"
export const IWI_STANDARD_VERSION = "Stats NZ 2023 Census Guide Notes iwi list / Census iwi and iwi-related groups V2.1.0"

export const ETHNICITY_OPTIONS = [
  { "key": "nz_european", "label": "New Zealand European" },
  { "key": "maori", "label": "Māori" },
  { "key": "samoan", "label": "Samoan" },
  { "key": "cook_islands_maori", "label": "Cook Islands Māori" },
  { "key": "tongan", "label": "Tongan" },
  { "key": "niuean", "label": "Niuean" },
  { "key": "chinese", "label": "Chinese" },
  { "key": "indian", "label": "Indian" }
]

export const IWI_GROUPS = [
  { "region": "Te Tai Tokerau / Tāmaki-makaurau (Northland / Auckland)", "options": ["Te Aupōuri","Ngāti Kahu","Ngāti Kurī","Ngāpuhi","Ngāpuhi ki Whaingaroa-Ngāti Kahu ki Whaingaroa","Te Rarawa","Ngāi Takoto","Ngāti Wai","Ngāti Whātua (not Ōrākei or Kaipara)","Te Kawerau ā Maki","Te Uri-o-Hau","Te Roroa","Ngāti Whātua o Kaipara","Ngāti Whātua o Ōrākei","Ngāi Tai ki Tāmaki","Ngāti Hine (Te Tai Tokerau)","Te Paatu","Ngāti Manuhiri","Ngāti Rehua","Ngāti Torehina ki Mata-ure ō Hau"] },
  { "region": "Hauraki (Coromandel)", "options": ["Ngāti Hako","Ngāti Hei","Ngāti Maru (Hauraki)","Ngāti Paoa","Patukirikiri","Ngāti Porou ki Harataunga ki Mataora","Ngāti Pūkenga ki Waiau","Ngāti Rāhiri Tumutumu","Ngāti Tamaterā","Ngāti Tara Tokanui","Ngāti Whanaunga","Ngāti Huarere"] },
  { "region": "Waikato / Te Rohe Pōtae (Waikato / King Country)", "options": ["Ngāti Haua (Waikato)","Ngāti Maniapoto","Raukawa (Waikato)","Waikato","Ngāti Te Ata","Ngāti Hīkairo","Rereahu","Ngāti Tiipa","Ngāti Korokī Kahukura","Ngāti Tamaoho","Te Ākitai-Waiohua","Tainui Awhiro"] },
  { "region": "Te Arawa / Taupō (Rotorua / Taupō)", "options": ["Ngāti Pikiao (Te Arawa)","Ngāti Rangiteaorere (Te Arawa)","Ngāti Rangitihi (Te Arawa)","Ngāti Rangiwewehi (Te Arawa)","Tapuika (Te Arawa)","Ngāti Tarāwhai (Te Arawa)","Tūhourangi (Te Arawa)","Uenuku-Kōpako (Te Arawa)","Waitaha (Te Arawa)","Ngāti Whakaue (Te Arawa)","Ngāti Tūwharetoa (ki Taupō)","Ngāti Tahu-Ngāti Whaoa (Te Arawa)","Ngāti Mākino","Ngāti Kearoa / Ngāti Tuarā","Ngāti Rongomai (Te Arawa)"] },
  { "region": "Tauranga Moana / Mātaatua (Bay of Plenty)", "options": ["Ngāti Pūkenga","Ngāi Te Rangi","Ngāti Ranginui","Ngāti Awa","Ngāti Manawa","Ngāi Tai (Tauranga Moana / Mātaatua)","Tūhoe","Whakatōhea","Te Whānau-ā-Apanui","Ngāti Whare","Ngā Pōtiki ā Tamapahore","Te Upokorehe","Ngāti Tūwharetoa ki Kawerau"] },
  { "region": "Te Tai Rāwhiti (East Coast)", "options": ["Ngāti Porou","Te Aitanga-a-Māhaki","Rongowhakaata","Ngāi Tāmanuhiri","Te Aitanga ā Hauiti"] },
  { "region": "Te Matau-a-Māui / Wairarapa (Hawke’s Bay / Wairarapa)", "options": ["Rongomaiwahine (Te Māhia)","Ngāti Kahungunu ki Te Wairoa","Ngāti Kahungunu ki Heretaunga","Ngāti Kahungunu ki Wairarapa","Rangitāne (Te Matau-a-Māui / Hawke’s Bay / Wairarapa)","Ngāti Kahungunu ki Te Whanganui-a-Orotu","Ngāti Kahungunu ki Tamatea","Ngāti Kahungunu ki Tamakinui a Rua","Ngāti Pāhauwera","Ngāti Rākaipaaka","Ngāti Hineuru","Maungaharuru Tangitū","Rangitāne o Tamaki nui ā Rua","Ngāti Ruapani ki Waikaremoana","Te Hika o Pāpāuma","Ngāti Hinemanu (Heretaunga)"] },
  { "region": "Taranaki", "options": ["Te Atiawa (Taranaki)","Ngāti Maru (Taranaki)","Ngāti Mutunga (Taranaki)","Ngā Rauru","Ngā Ruahine","Ngāti Ruanui","Ngāti Tama (Taranaki)","Taranaki","Tangāhoe","Pakakohi"] },
  { "region": "Whanganui / Rangitīkei", "options": ["Ngāti Apa (Rangitīkei)","Te Ati Haunui-a-Pāpārangi","Ngāti Haua (Taumarunui)","Ngāti Hauiti (Rangitīkei)","Ngāti Whitikaupeka (Rangitīkei)","Ngāi Te Ohuake (Rangitīkei)","Ngāti Tamakōpiri (Rangitīkei)","Ngāti Rangi (Ruapehu, Whanganui)","Uenuku (Ruapehu, Waimarino)","Tamahaki (Ruapehu, Waimarino)","Tamakana (Ruapehu, Waimarino)","Ngāti Hinemanu (Rangitīkei)"] },
  { "region": "Manawatū / Horowhenua / Te Whanganui-a-Tara", "options": ["Te Atiawa (Te Whanganui-a-Tara / Wellington)","Muaūpoko","Rangitāne (Manawatū)","Ngāti Raukawa (Horowhenua / Manawatū)","Ngāti Toarangatira (Te Whanganui-a-Tara / Wellington)","Te Atiawa ki Whakarongotai","Ngāti Tama ki Te Upoko o Te Ika (Te Whanganui-a-Tara / Wellington)","Ngāti Kauwhata","Ngāti Tukorehe"] },
  { "region": "Te Waipounamu (South Island)", "options": ["Te Atiawa (Te Waipounamu / South Island)","Ngāti Koata","Ngāti Kuia","Kāti Māmoe","Rangitāne (Te Waipounamu / South Island)","Ngāti Rārua","Ngāi Tahu / Kāi Tahu","Ngāti Tama ki Te Tauihu","Ngāti Toarangatira (Te Waipounamu / South Island)","Waitaha (Te Waipounamu / South Island)","Ngāti Apa ki Te Rā Tō"] },
  { "region": "Rēkohu / Wharekauri (Chatham Islands)", "options": ["Moriori","Ngāti Mutunga (Wharekauri / Chatham Islands)"] }
]

export const IWI_OPTIONS = IWI_GROUPS.flatMap((group) =>
  group.options.map((label) => ({ label, region: group.region })),
)

const ethnicityByKey = new Map(ETHNICITY_OPTIONS.map((option) => [option.key, option]))
const iwiLabels = new Set(IWI_OPTIONS.map((option) => option.label))

function cleanText(value, maxLength = 100) {
  if (typeof value !== "string") return ""
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength)
}

function uniqueByLabel(items) {
  const seen = new Set()
  const result = []
  for (const item of items) {
    const key = item.label.toLocaleLowerCase("en-NZ")
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }
  return result
}

function parseOtherEthnicities(value) {
  const rawItems = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : []
  return rawItems.map((item) => cleanText(item, 50)).filter(Boolean).slice(0, 6).map((label) => ({ key: null, label, source: "other" }))
}

export function sanitizeDemographicsInput(input = {}) {
  const preferNotToSay = input.ethnicityPreferNotToSay === true
  const requestedEthnicityKeys = Array.isArray(input.ethnicities) ? input.ethnicities : []
  const standardEthnicities = requestedEthnicityKeys
    .map((key) => ethnicityByKey.get(typeof key === "string" ? key : ""))
    .filter(Boolean)
    .slice(0, 8)
    .map((option) => ({ key: option.key, label: option.label, source: "stats_nz_standard_question" }))

  const ethnicityResponses = preferNotToSay ? [] : uniqueByLabel([...standardEthnicities, ...parseOtherEthnicities(input.otherEthnicities)]).slice(0, 12)
  const ethnicityResponseStatus = preferNotToSay ? "prefer_not_to_say" : ethnicityResponses.length > 0 ? "provided" : "not_stated"

  const requestedIwi = Array.isArray(input.iwiAffiliations) ? input.iwiAffiliations : []
  const standardIwi = requestedIwi.map((value) => cleanText(value, 100)).filter((label) => iwiLabels.has(label)).slice(0, 12).map((label) => ({ label, source: "stats_nz_2023_guide" }))
  const customIwiRaw = Array.isArray(input.otherIwi) ? input.otherIwi : typeof input.otherIwi === "string" ? input.otherIwi.split(",") : []
  const customIwi = customIwiRaw.map((value) => cleanText(value, 100)).filter(Boolean).slice(0, 6).map((label) => ({ label, source: iwiLabels.has(label) ? "stats_nz_2023_guide" : "user_supplied" }))
  const iwiAffiliations = uniqueByLabel([...standardIwi, ...customIwi]).slice(0, 12)
  const requestedIwiStatus = typeof input.iwiResponseStatus === "string" ? input.iwiResponseStatus : "not_stated"
  const allowedIwiStatuses = new Set(["not_stated", "dont_know", "none", "prefer_not_to_say"])
  const explicitNoAffiliationStatuses = new Set(["dont_know", "none", "prefer_not_to_say"])
  const iwiResponseStatus = explicitNoAffiliationStatuses.has(requestedIwiStatus)
    ? requestedIwiStatus
    : iwiAffiliations.length > 0
      ? "provided"
      : allowedIwiStatuses.has(requestedIwiStatus)
        ? requestedIwiStatus
        : "not_stated"

  return {
    ethnicityResponses,
    ethnicityResponseStatus,
    iwiAffiliations: iwiResponseStatus === "provided" ? iwiAffiliations : [],
    iwiResponseStatus,
    collectionNoticeVersion: DEMOGRAPHICS_NOTICE_VERSION,
    ethnicityStandardVersion: ETHNICITY_STANDARD_VERSION,
    iwiStandardVersion: IWI_STANDARD_VERSION,
  }
}
