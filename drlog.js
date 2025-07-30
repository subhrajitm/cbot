// Global variables
let casesData = [];
let filteredData = {
    'all': [],
    'categorization': [],
    'design-engineer': [],
    'engineer-reviewer': [],
    'engineer-approver': [],
    'customer': [],
    'work-stoppage': []
};

// Pagination functionality
const defaultItemsPerPage = 5;
const paginationState = {
    'all': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'categorization': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'design-engineer': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'engineer-reviewer': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'engineer-approver': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'customer': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'work-stoppage': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage }
};

// Case data stored in variable
const casesDataVariable = {
    "cases": [
        {
    "Rank": 1,
    "Case Number": "Case132",
    "ESN": "ESN892",
    "Case Record Type": "SDR",
    "Priority": "Work Stoppage",
    "Dwell": 9,
    "Current Stage": "Design Engineer",
    "Open Date": "2025-07-18",
    "Categorization": "2025-07-21",
    "Design Engineer": "2025-07-21",
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ269G - Fretting and BR2 Undersize",
    "Categorization TAT": "2025-07-19",
    "Design Engineer TAT": "2025-07-23",
    "Engineer Reiviewer TAT": "2025-07-26",
    "Engineer Approver TAT": "2025-07-29",
    "Customer Approval TAT": "2025-08-01",
    "DR Closed TAT": "2025-08-01"
  },
  {
    "Rank": 2,
    "Case Number": "Case121",
    "ESN": "ESN328",
    "Case Record Type": "SDR",
    "Priority": "Work Stoppage",
    "Dwell": 8,
    "Current Stage": "Engineer Approver",
    "Open Date": "2025-07-18",
    "Categorization": "2025-07-21",
    "Design Engineer": "2025-07-21",
    "Engineer Reiviewer": "2025-07-22",
    "Engineer Approver": "2025-07-22",
    "Customer Approval": null,
    "Engine Model": "EM2",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ467H - Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-19",
    "Design Engineer TAT": "2025-07-23",
    "Engineer Reiviewer TAT": "2025-07-26",
    "Engineer Approver TAT": "2025-07-29",
    "Customer Approval TAT": "2025-08-01",
    "DR Closed TAT": "2025-08-01"
  },
  {
    "Rank": 3,
    "Case Number": "Case112",
    "ESN": "ESN573",
    "Case Record Type": "SDR",
    "Priority": "Work Stoppage",
    "Dwell": 8,
    "Current Stage": "Engineer Approver",
    "Open Date": "7/21/2025",
    "Categorization": "2025-07-22",
    "Design Engineer": "2025-07-22",
    "Engineer Reiviewer": "2025-07-22",
    "Engineer Approver": "2025-07-22",
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "Forward Outer Seal - Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-22",
    "Design Engineer TAT": "2025-07-26",
    "Engineer Reiviewer TAT": "2025-07-29",
    "Engineer Approver TAT": "2025-08-01",
    "Customer Approval TAT": "2025-08-04",
    "DR Closed TAT": "2025-08-04"
  },
  {
    "Rank": 4,
    "Case Number": "Case127",
    "ESN": "ESN777",
    "Case Record Type": "CDR",
    "Priority": "Work Stoppage",
    "Dwell": 7,
    "Current Stage": "Categorization",
    "Open Date": "2025-07-21",
    "Categorization": "2025-07-23",
    "Design Engineer": null,
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM2",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "ABCD843H - Fretting and Erosion",
    "Categorization TAT": "2025-07-22",
    "Design Engineer TAT": "2025-07-26",
    "Engineer Reiviewer TAT": "2025-07-29",
    "Engineer Approver TAT": "2025-08-01",
    "Customer Approval TAT": "2025-08-04",
    "DR Closed TAT": "2025-08-04"
  },
  {
    "Rank": 5,
    "Case Number": "Case116",
    "ESN": "ESN291",
    "Case Record Type": "SDR",
    "Priority": "Work Stoppage",
    "Dwell": 6,
    "Current Stage": "Engineer Approver",
    "Open Date": "7/14/2025",
    "Categorization": "2025-07-22",
    "Design Engineer": "2025-07-22",
    "Engineer Reiviewer": "2025-07-22",
    "Engineer Approver": "2025-07-24",
    "Customer Approval": null,
    "Engine Model": "EM2",
    "ATA": "ST-4T-02",
    "Part Name": "COMBUSTION CHAMBER INNER LINER",
    "Title": "During incoming condition, it was verified spalling on TBC, out of ESM Limits. ",
    "Categorization TAT": "2025-07-15",
    "Design Engineer TAT": "2025-07-19",
    "Engineer Reiviewer TAT": "2025-07-22",
    "Engineer Approver TAT": "2025-07-25",
    "Customer Approval TAT": "2025-07-28",
    "DR Closed TAT": "2025-07-28"
  },
  {
    "Rank": 6,
    "Case Number": "Case140",
    "ESN": "ESN918",
    "Case Record Type": "SDR",
    "Priority": "Work Stoppage",
    "Dwell": 5,
    "Current Stage": "Categorization",
    "Open Date": "2025-07-25",
    "Categorization": "2025-07-25",
    "Design Engineer": null,
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM2",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "D9195G - Fretting, Galling",
    "Categorization TAT": "2025-07-26",
    "Design Engineer TAT": "2025-07-30",
    "Engineer Reiviewer TAT": "2025-08-02",
    "Engineer Approver TAT": "2025-08-05",
    "Customer Approval TAT": "2025-08-08",
    "DR Closed TAT": "2025-08-08"
  },
  {
    "Rank": 7,
    "Case Number": "Case138",
    "ESN": "ESN536",
    "Case Record Type": "SDR",
    "Priority": "Work Stoppage",
    "Dwell": 5,
    "Current Stage": "Engineer Reiviewer",
    "Open Date": "2025-07-21",
    "Categorization": "2025-07-23",
    "Design Engineer": "2025-07-23",
    "Engineer Reiviewer": "2025-07-25",
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "D8707D - Fretting and Bayonet Damage",
    "Categorization TAT": "2025-07-22",
    "Design Engineer TAT": "2025-07-26",
    "Engineer Reiviewer TAT": "2025-07-29",
    "Engineer Approver TAT": "2025-08-01",
    "Customer Approval TAT": "2025-08-04",
    "DR Closed TAT": "2025-08-04"
  },
  {
    "Rank": 8,
    "Case Number": "Case135",
    "ESN": "ESN996",
    "Case Record Type": "SDR",
    "Priority": "Work Stoppage",
    "Dwell": 5,
    "Current Stage": "Engineer Approver",
    "Open Date": "2025-07-21",
    "Categorization": "2025-07-21",
    "Design Engineer": "2025-07-21",
    "Engineer Reiviewer": "2025-07-22",
    "Engineer Approver": "2025-07-25",
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-4T-02",
    "Part Name": "COMBUSTION CHAMBER INNER LINER",
    "Title": "During incoming condition, it was verified 01 EA Retainer on the Domeplate with distortion and Cracks on Deflectors and Spalling of TBC.",
    "Categorization TAT": "2025-07-22",
    "Design Engineer TAT": "2025-07-26",
    "Engineer Reiviewer TAT": "2025-07-29",
    "Engineer Approver TAT": "2025-08-01",
    "Customer Approval TAT": "2025-08-04",
    "DR Closed TAT": "2025-08-04"
  },
  {
    "Rank": 9,
    "Case Number": "Case124",
    "ESN": "ESN558",
    "Case Record Type": "SDR",
    "Priority": "Work Stoppage",
    "Dwell": 5,
    "Current Stage": "Engineer Reiviewer",
    "Open Date": "2025-07-24",
    "Categorization": "2025-07-24",
    "Design Engineer": "2025-07-24",
    "Engineer Reiviewer": "2025-07-25",
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "ABCD337G - Wear/Fretting",
    "Categorization TAT": "2025-07-25",
    "Design Engineer TAT": "2025-07-29",
    "Engineer Reiviewer TAT": "2025-08-01",
    "Engineer Approver TAT": "2025-08-04",
    "Customer Approval TAT": "2025-08-07",
    "DR Closed TAT": "2025-08-07"
  },
  {
    "Rank": 10,
    "Case Number": "Case139",
    "ESN": "ESN817",
    "Case Record Type": "CDR",
    "Priority": "Routine",
    "Dwell": 15,
    "Current Stage": "Design Engineer",
    "Open Date": "2025-07-14",
    "Categorization": "2025-07-14",
    "Design Engineer": "2025-07-15",
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "Fretting Disk Mate face, Nick inner mate face",
    "Categorization TAT": "2025-07-15",
    "Design Engineer TAT": "2025-07-19",
    "Engineer Reiviewer TAT": "2025-07-22",
    "Engineer Approver TAT": "2025-07-25",
    "Customer Approval TAT": "2025-07-28",
    "DR Closed TAT": "2025-07-28"
  },
  {
    "Rank": 11,
    "Case Number": "Case126",
    "ESN": "ESN963",
    "Case Record Type": "CDR",
    "Priority": "Routine",
    "Dwell": 13,
    "Current Stage": "Engineer Reiviewer",
    "Open Date": "2025-07-14",
    "Categorization": "2025-07-14",
    "Design Engineer": "2025-07-14",
    "Engineer Reiviewer": "2025-07-17",
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "ABCD865H - Wear/Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-15",
    "Design Engineer TAT": "2025-07-19",
    "Engineer Reiviewer TAT": "2025-07-22",
    "Engineer Approver TAT": "2025-07-25",
    "Customer Approval TAT": "2025-07-28",
    "DR Closed TAT": "2025-07-28"
  },
  {
    "Rank": 12,
    "Case Number": "Case131",
    "ESN": "ESN572",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 12,
    "Current Stage": "Engineer Reiviewer",
    "Open Date": "2025-07-16",
    "Categorization": "2025-07-17",
    "Design Engineer": "2025-07-18",
    "Engineer Reiviewer": "2025-07-18",
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ128C - Fretting and BR2 Undersize",
    "Categorization TAT": "2025-07-17",
    "Design Engineer TAT": "2025-07-21",
    "Engineer Reiviewer TAT": "2025-07-24",
    "Engineer Approver TAT": "2025-07-27",
    "Customer Approval TAT": "2025-07-30",
    "DR Closed TAT": "2025-07-30"
  },
  {
    "Rank": 13,
    "Case Number": "Case129",
    "ESN": "ESN818",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 9,
    "Current Stage": "Engineer Approver",
    "Open Date": "2025-07-17",
    "Categorization": "2025-07-18",
    "Design Engineer": "2025-07-18",
    "Engineer Reiviewer": "2025-07-18",
    "Engineer Approver": "2025-07-21",
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ315E - Fretting Outer Disk Mate Face and Hubface",
    "Categorization TAT": "2025-07-18",
    "Design Engineer TAT": "2025-07-22",
    "Engineer Reiviewer TAT": "2025-07-25",
    "Engineer Approver TAT": "2025-07-28",
    "Customer Approval TAT": "2025-07-31",
    "DR Closed TAT": "2025-07-31"
  },
  {
    "Rank": 14,
    "Case Number": "Case118",
    "ESN": "ESN372",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 9,
    "Current Stage": "Engineer Approver",
    "Open Date": "2025-07-16",
    "Categorization": "2025-07-16",
    "Design Engineer": "2025-07-16",
    "Engineer Reiviewer": "2025-07-17",
    "Engineer Approver": "2025-07-21",
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ144H - Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-17",
    "Design Engineer TAT": "2025-07-21",
    "Engineer Reiviewer TAT": "2025-07-24",
    "Engineer Approver TAT": "2025-07-27",
    "Customer Approval TAT": "2025-07-30",
    "DR Closed TAT": "2025-07-30"
  },
  {
    "Rank": 15,
    "Case Number": "Case113",
    "ESN": "ESN422",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 9,
    "Current Stage": "Design Engineer",
    "Open Date": "7/18/2025",
    "Categorization": "2025-07-21",
    "Design Engineer": "2025-07-21",
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "FORWARD OUTER SEAL - Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-19",
    "Design Engineer TAT": "2025-07-23",
    "Engineer Reiviewer TAT": "2025-07-26",
    "Engineer Approver TAT": "2025-07-29",
    "Customer Approval TAT": "2025-08-01",
    "DR Closed TAT": "2025-08-01"
  },
  {
    "Rank": 16,
    "Case Number": "Case125",
    "ESN": "ESN685",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 8,
    "Current Stage": "Engineer Approver",
    "Open Date": "2025-07-16",
    "Categorization": "2025-07-18",
    "Design Engineer": "2025-07-21",
    "Engineer Reiviewer": "2025-07-22",
    "Engineer Approver": "2025-07-22",
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-4T-02",
    "Part Name": "COMBUSTION CHAMBER INNER LINER",
    "Title": "During incoming condition, it was verified Spalling on TBC and Crack on FWD Flange, out of ESM Limits. ",
    "Categorization TAT": "2025-07-17",
    "Design Engineer TAT": "2025-07-21",
    "Engineer Reiviewer TAT": "2025-07-24",
    "Engineer Approver TAT": "2025-07-27",
    "Customer Approval TAT": "2025-07-30",
    "DR Closed TAT": "2025-07-30"
  },
  {
    "Rank": 17,
    "Case Number": "Case114",
    "ESN": "ESN674",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 8,
    "Current Stage": "Engineer Approver",
    "Open Date": "7/16/2025",
    "Categorization": "2025-07-21",
    "Design Engineer": "2025-07-21",
    "Engineer Reiviewer": "2025-07-21",
    "Engineer Approver": "2025-07-22",
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "Forward Outer Seal - Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-17",
    "Design Engineer TAT": "2025-07-21",
    "Engineer Reiviewer TAT": "2025-07-24",
    "Engineer Approver TAT": "2025-07-27",
    "Customer Approval TAT": "2025-07-30",
    "DR Closed TAT": "2025-07-30"
  },
  {
    "Rank": 18,
    "Case Number": "Case111",
    "ESN": "ESN939",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 8,
    "Current Stage": "Engineer Approver",
    "Open Date": "2025-07-22",
    "Categorization": "2025-07-22",
    "Design Engineer": "2025-07-22",
    "Engineer Reiviewer": "2025-07-22",
    "Engineer Approver": "2025-07-22",
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "Forward Outer Seal - Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-23",
    "Design Engineer TAT": "2025-07-27",
    "Engineer Reiviewer TAT": "2025-07-30",
    "Engineer Approver TAT": "2025-08-02",
    "Customer Approval TAT": "2025-08-05",
    "DR Closed TAT": "2025-08-05"
  },
  {
    "Rank": 19,
    "Case Number": "Case115",
    "ESN": "ESN497",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 7,
    "Current Stage": "Engineer Approver",
    "Open Date": "7/15/2025",
    "Categorization": "2025-07-22",
    "Design Engineer": "2025-07-22",
    "Engineer Reiviewer": "2025-07-22",
    "Engineer Approver": "2025-07-23",
    "Customer Approval": null,
    "Engine Model": "EM2",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "Forward Outer Seal - Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-16",
    "Design Engineer TAT": "2025-07-20",
    "Engineer Reiviewer TAT": "2025-07-23",
    "Engineer Approver TAT": "2025-07-26",
    "Customer Approval TAT": "2025-07-29",
    "DR Closed TAT": "2025-07-29"
  },
  {
    "Rank": 20,
    "Case Number": "Case136",
    "ESN": "ESN414",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 6,
    "Current Stage": "Design Engineer",
    "Open Date": "2025-07-23",
    "Categorization": "2025-07-24",
    "Design Engineer": "2025-07-24",
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM2",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "D8200B - Fretting Disk Mate Face, Hubface Nicks, Machine Mismatch",
    "Categorization TAT": "2025-07-24",
    "Design Engineer TAT": "2025-07-28",
    "Engineer Reiviewer TAT": "2025-07-31",
    "Engineer Approver TAT": "2025-08-03",
    "Customer Approval TAT": "2025-08-06",
    "DR Closed TAT": "2025-08-06"
  },
  {
    "Rank": 21,
    "Case Number": "Case134",
    "ESN": "ESN826",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 5,
    "Current Stage": "Engineer Approver",
    "Open Date": "2025-07-21",
    "Categorization": "2025-07-23",
    "Design Engineer": "2025-07-25",
    "Engineer Reiviewer": "2025-07-25",
    "Engineer Approver": "2025-07-25",
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ675H - Fretting and Dents",
    "Categorization TAT": "2025-07-22",
    "Design Engineer TAT": "2025-07-26",
    "Engineer Reiviewer TAT": "2025-07-29",
    "Engineer Approver TAT": "2025-08-01",
    "Customer Approval TAT": "2025-08-04",
    "DR Closed TAT": "2025-08-04"
  },
  {
    "Rank": 22,
    "Case Number": "Case133",
    "ESN": "ESN858",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 5,
    "Current Stage": "Categorization",
    "Open Date": "2025-07-24",
    "Categorization": "2025-07-25",
    "Design Engineer": null,
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ487B - Fretting Outer Disk Mate Face and Hubface",
    "Categorization TAT": "2025-07-25",
    "Design Engineer TAT": "2025-07-29",
    "Engineer Reiviewer TAT": "2025-08-01",
    "Engineer Approver TAT": "2025-08-04",
    "Customer Approval TAT": "2025-08-07",
    "DR Closed TAT": "2025-08-07"
  },
  {
    "Rank": 23,
    "Case Number": "Case128",
    "ESN": "ESN639",
    "Case Record Type": "CDR",
    "Priority": "Routine",
    "Dwell": 5,
    "Current Stage": "Design Engineer",
    "Open Date": "2025-07-22",
    "Categorization": "2025-07-24",
    "Design Engineer": "2025-07-25",
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM2",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ235K - Fretting and Dents",
    "Categorization TAT": "2025-07-23",
    "Design Engineer TAT": "2025-07-27",
    "Engineer Reiviewer TAT": "2025-07-30",
    "Engineer Approver TAT": "2025-08-02",
    "Customer Approval TAT": "2025-08-05",
    "DR Closed TAT": "2025-08-05"
  },
  {
    "Rank": 24,
    "Case Number": "Case123",
    "ESN": "ESN903",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 5,
    "Current Stage": "Customer Approval",
    "Open Date": "2025-07-14",
    "Categorization": "2025-07-15",
    "Design Engineer": "2025-07-15",
    "Engineer Reiviewer": "2025-07-18",
    "Engineer Approver": "2025-07-21",
    "Customer Approval": "2025-07-25",
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ880B - Fretting Outer Disk Mate Face",
    "Categorization TAT": "2025-07-15",
    "Design Engineer TAT": "2025-07-19",
    "Engineer Reiviewer TAT": "2025-07-22",
    "Engineer Approver TAT": "2025-07-25",
    "Customer Approval TAT": "2025-07-28",
    "DR Closed TAT": "2025-07-28"
  },
  {
    "Rank": 25,
    "Case Number": "Case122",
    "ESN": "ESN747",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 5,
    "Current Stage": "Design Engineer",
    "Open Date": "2025-07-25",
    "Categorization": "2025-07-25",
    "Design Engineer": "2025-07-25",
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM2",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ916D - Fretting Outer Disk Mate Face",
    "Categorization TAT": "2025-07-26",
    "Design Engineer TAT": "2025-07-30",
    "Engineer Reiviewer TAT": "2025-08-02",
    "Engineer Approver TAT": "2025-08-05",
    "Customer Approval TAT": "2025-08-08",
    "DR Closed TAT": "2025-08-08"
  },
  {
    "Rank": 26,
    "Case Number": "Case119",
    "ESN": "ESN258",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 5,
    "Current Stage": "Categorization",
    "Open Date": "2025-07-23",
    "Categorization": "2025-07-25",
    "Design Engineer": null,
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ363D - Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-24",
    "Design Engineer TAT": "2025-07-28",
    "Engineer Reiviewer TAT": "2025-07-31",
    "Engineer Approver TAT": "2025-08-03",
    "Customer Approval TAT": "2025-08-06",
    "DR Closed TAT": "2025-08-06"
  },
  {
    "Rank": 27,
    "Case Number": "Case117",
    "ESN": "ESN973",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 5,
    "Current Stage": "Engineer Approver",
    "Open Date": "2025-07-23",
    "Categorization": "2025-07-23",
    "Design Engineer": "2025-07-23",
    "Engineer Reiviewer": "2025-07-23",
    "Engineer Approver": "2025-07-25",
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "Outer Disk Mate Face Fretting",
    "Categorization TAT": "2025-07-24",
    "Design Engineer TAT": "2025-07-28",
    "Engineer Reiviewer TAT": "2025-07-31",
    "Engineer Approver TAT": "2025-08-03",
    "Customer Approval TAT": "2025-08-06",
    "DR Closed TAT": "2025-08-06"
  },
  {
    "Rank": 28,
    "Case Number": "Case137",
    "ESN": "ESN302",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 2,
    "Current Stage": "Design Engineer",
    "Open Date": "2025-07-25",
    "Categorization": "2025-07-25",
    "Design Engineer": "2025-07-28",
    "Engineer Reiviewer": null,
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM2",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "Forward Outer Seal - Fretting on Outer Disk Mate Face and Mid Rabbet",
    "Categorization TAT": "2025-07-26",
    "Design Engineer TAT": "2025-07-30",
    "Engineer Reiviewer TAT": "2025-08-02",
    "Engineer Approver TAT": "2025-08-05",
    "Customer Approval TAT": "2025-08-08",
    "DR Closed TAT": "2025-08-08"
  },
  {
    "Rank": 29,
    "Case Number": "Case130",
    "ESN": "ESN215",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 2,
    "Current Stage": "Engineer Reiviewer",
    "Open Date": "2025-07-21",
    "Categorization": "2025-07-23",
    "Design Engineer": "2025-07-24",
    "Engineer Reiviewer": "2025-07-28",
    "Engineer Approver": null,
    "Customer Approval": null,
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ108C - Fretting and Dents",
    "Categorization TAT": "2025-07-22",
    "Design Engineer TAT": "2025-07-26",
    "Engineer Reiviewer TAT": "2025-07-29",
    "Engineer Approver TAT": "2025-08-01",
    "Customer Approval TAT": "2025-08-04",
    "DR Closed TAT": "2025-08-04"
  },
  {
    "Rank": 30,
    "Case Number": "Case120",
    "ESN": "ESN202",
    "Case Record Type": "SDR",
    "Priority": "Routine",
    "Dwell": 2,
    "Current Stage": "Customer Approval",
    "Open Date": "2025-07-21",
    "Categorization": "2025-07-21",
    "Design Engineer": "2025-07-21",
    "Engineer Reiviewer": "2025-07-22",
    "Engineer Approver": "2025-07-24",
    "Customer Approval": "2025-07-28",
    "Engine Model": "EM1",
    "ATA": "ST-S2-42",
    "Part Name": "HPT Rotor Forward Outer Seal (FOS)",
    "Title": "XYZ392K - Fretting on Outer Disk Mate Face",
    "Categorization TAT": "2025-07-22",
    "Design Engineer TAT": "2025-07-26",
    "Engineer Reiviewer TAT": "2025-07-29",
    "Engineer Approver TAT": "2025-08-01",
    "Customer Approval TAT": "2025-08-04",
    "DR Closed TAT": "2025-08-04"
        }
    ]
};

// Load data from variable instead of file
function loadCasesData() {
    try {
        // Map the data to match the expected field names
        casesData = casesDataVariable.cases.map(caseItem => ({
            caseNumber: caseItem["Case Number"],
            esn: caseItem["ESN"],
            type: caseItem["Case Record Type"],
            priority: caseItem["Priority"],
            engineModel: caseItem["Engine Model"],
            ata: caseItem["ATA"],
            partName: caseItem["Part Name"],
            title: caseItem["Title"],
            currentStage: caseItem["Current Stage"],
            openDate: caseItem["Open Date"],
            // Actual dates
            categorizationActual: caseItem["Categorization"],
            designEngineerActual: caseItem["Design Engineer"],
            engineerReviewerActual: caseItem["Engineer Reiviewer"],
            engineerApproverActual: caseItem["Engineer Approver"],
            customerApprovalActual: caseItem["Customer Approval"],
            // Expected dates (TAT)
            categorization: caseItem["Categorization TAT"],
            designEngineer: caseItem["Design Engineer TAT"],
            engineerReviewer: caseItem["Engineer Reiviewer TAT"],
            engineerApprover: caseItem["Engineer Approver TAT"],
            customerApproval: caseItem["Customer Approval TAT"]
        }));
        
        // Filter data for each tab
        filterDataByStage();
        
        // Initialize pagination for all tabs
        Object.keys(paginationState).forEach(tabId => {
            paginationState[tabId].totalItems = filteredData[tabId].length;
            initializePagination(tabId);
        });
        
        // Update tab badges
        updateTabBadges();
        
        // Initialize timeline for first case
        if (casesData.length > 0) {
            updateTimelineForCase(casesData[0]);
        }
        
        // Initialize rows per page dropdowns
        initializeRowsPerPageDropdowns();
        
    } catch (error) {
        console.error('Error loading cases data:', error);
    }
}

// Initialize rows per page dropdowns
function initializeRowsPerPageDropdowns() {
    Object.keys(paginationState).forEach(tabId => {
        const select = document.getElementById(`${tabId}-rows-per-page`);
        if (select) {
            // Set the current value
            select.value = paginationState[tabId].itemsPerPage;
            
            // Add change event listener
            select.addEventListener('change', function() {
                const newItemsPerPage = parseInt(this.value);
                paginationState[tabId].itemsPerPage = newItemsPerPage;
                paginationState[tabId].currentPage = 1; // Reset to first page
                initializePagination(tabId);
            });
        }
    });
}

// Filter data by current stage
function filterDataByStage() {
    filteredData['all'] = casesData;
    filteredData['categorization'] = casesData.filter(caseItem => caseItem.currentStage === 'Categorization');
    filteredData['design-engineer'] = casesData.filter(caseItem => caseItem.currentStage === 'Design Engineer');
    filteredData['engineer-reviewer'] = casesData.filter(caseItem => caseItem.currentStage === 'Engineer Reviewer');
    filteredData['engineer-approver'] = casesData.filter(caseItem => caseItem.currentStage === 'Engineer Approver');
    filteredData['customer'] = casesData.filter(caseItem => caseItem.currentStage === 'Customer Approval');
    filteredData['work-stoppage'] = casesData.filter(caseItem => caseItem.priority === 'Work Stoppage');
}

// Update tab badges with counts
function updateTabBadges() {
    const tabBadges = {
        'all': filteredData['all'].length,
        'categorization': filteredData['categorization'].length,
        'design-engineer': filteredData['design-engineer'].length,
        'engineer-reviewer': filteredData['engineer-reviewer'].length,
        'engineer-approver': filteredData['engineer-approver'].length,
        'customer': filteredData['customer'].length,
        'work-stoppage': filteredData['work-stoppage'].length
    };
    
    Object.keys(tabBadges).forEach(tabId => {
        const badge = document.querySelector(`#${tabId}-tab .badge`);
        if (badge) {
            badge.textContent = tabBadges[tabId];
        }
    });
}

// Create table row from case data
function createTableRow(caseItem) {
    const row = document.createElement('tr');
    
    // Add click event to highlight row and update timeline
    row.addEventListener('click', () => {
            // Remove highlight from all rows
        document.querySelectorAll('.case-table tbody tr').forEach(r => r.classList.remove('highlighted'));
        // Add highlight to clicked row
        row.classList.add('highlighted');
        // Update timeline for this case
        updateTimelineForCase(caseItem);
    });
    
    // Create priority badge class
    const priorityClass = caseItem.priority === 'Work Stoppage' ? 'priority-work-stoppage' : 'priority-routine';
    
    row.innerHTML = `
        <td>${caseItem.caseNumber}</td>
        <td>${caseItem.esn}</td>
        <td>${caseItem.type}</td>
        <td><span class="priority-badge ${priorityClass}">${caseItem.priority}</span></td>
        <td>${caseItem.engineModel}</td>
        <td>${caseItem.ata}</td>
        <td>${caseItem.partName}</td>
        <td>${caseItem.title}</td>
        <td>${caseItem.currentStage}</td>
        <td>${caseItem.openDate}</td>
        <td>${caseItem.categorization || ''}</td>
        <td>${caseItem.designEngineer || ''}</td>
        <td>${caseItem.engineerReviewer || ''}</td>
        <td>${caseItem.engineerApprover || ''}</td>
        <td>${caseItem.customerApproval || ''}</td>
    `;
    
    return row;
}

// Populate table with data
function populateTable(tabId, data) {
    const tbody = document.getElementById(`${tabId}-tbody`);
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add new rows
    data.forEach(caseItem => {
        const row = createTableRow(caseItem);
        tbody.appendChild(row);
    });
}

// Initialize pagination for a tab
function initializePagination(tabId) {
    const currentPage = paginationState[tabId].currentPage;
    const totalItems = paginationState[tabId].totalItems;
    const itemsPerPage = paginationState[tabId].itemsPerPage;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Update pagination info
    updatePaginationInfo(tabId, currentPage, totalPages);
    
    // Update page buttons
    updatePageButtons(tabId, currentPage, totalPages);
    
    // Update navigation buttons
    updateNavigationButtons(tabId, currentPage, totalPages);
    
    // Update table rows
    updateTableRows(tabId, currentPage);
}

// Update pagination info text
function updatePaginationInfo(tabId, currentPage, totalPages) {
    const itemsPerPage = paginationState[tabId].itemsPerPage;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, paginationState[tabId].totalItems);
    const total = paginationState[tabId].totalItems;
    
    const startSpan = document.getElementById(`${tabId}-start`);
    const endSpan = document.getElementById(`${tabId}-end`);
    const totalSpan = document.getElementById(`${tabId}-total`);
    
    if (startSpan) startSpan.textContent = start;
    if (endSpan) endSpan.textContent = end;
    if (totalSpan) totalSpan.textContent = total;
}

// Update page number buttons
function updatePageButtons(tabId, currentPage, totalPages) {
    const pagesContainer = document.getElementById(`${tabId}-pages`);
    if (!pagesContainer) return;
    
    pagesContainer.innerHTML = '';
    
    // Show max 5 page buttons at a time
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add first page button if not visible
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'page-btn';
        firstBtn.setAttribute('data-page', 1);
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => goToPage(tabId, 1));
        pagesContainer.appendChild(firstBtn);
        
        // Add ellipsis if there's a gap
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pagesContainer.appendChild(ellipsis);
        }
    }
    
    // Add visible page buttons
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        button.setAttribute('data-page', i);
        button.textContent = i;
        button.addEventListener('click', () => goToPage(tabId, i));
        pagesContainer.appendChild(button);
    }
    
    // Add last page button if not visible
    if (endPage < totalPages) {
        // Add ellipsis if there's a gap
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pagesContainer.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'page-btn';
        lastBtn.setAttribute('data-page', totalPages);
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => goToPage(tabId, totalPages));
        pagesContainer.appendChild(lastBtn);
    }
}

// Update navigation buttons (Previous/Next)
function updateNavigationButtons(tabId, currentPage, totalPages) {
    const prevBtn = document.getElementById(`${tabId}-prev`);
    const nextBtn = document.getElementById(`${tabId}-next`);
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        // Remove existing event listeners
        prevBtn.replaceWith(prevBtn.cloneNode(true));
        const newPrevBtn = document.getElementById(`${tabId}-prev`);
        newPrevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                goToPage(tabId, currentPage - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        // Remove existing event listeners
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        const newNextBtn = document.getElementById(`${tabId}-next`);
        newNextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                goToPage(tabId, currentPage + 1);
            }
        });
    }
}

// Update table rows for current page
function updateTableRows(tabId, currentPage) {
    const itemsPerPage = paginationState[tabId].itemsPerPage;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData[tabId].slice(startIndex, endIndex);
    
    populateTable(tabId, pageData);
}

// Go to specific page
function goToPage(tabId, page) {
    paginationState[tabId].currentPage = page;
    initializePagination(tabId);
}

// Update timeline for a specific case
function updateTimelineForCase(caseItem) {
    // Update case info
    const caseInfo = document.querySelector('.case-details');
    if (caseInfo) {
        caseInfo.textContent = `Case: ${caseItem.caseNumber}, ESN: ${caseItem.esn}, Current State: ${caseItem.currentStage}`;
    }
    
    // Update progress bar
    updateProgressBar(caseItem.currentStage);
    
    // Update timeline states
    updateTimelineStates(caseItem.currentStage);
    
    // Update timeline dates with both actual and expected
    updateTimelineDates(caseItem);
}

// Update progress bar based on current stage
function updateProgressBar(currentStage) {
    const progressBar = document.getElementById('timeline-progress');
    const stageMap = {
        'Requester': 16.67,
        'Categorization': 33.33,
        'Design Engineer': 50,
        'Engineer Reviewer': 66.67,
        'Engineer Approver': 83.33,
        'Customer Approval': 100
    };
    
    const progress = stageMap[currentStage] || 0;
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Update timeline stage states
function updateTimelineStates(currentStage) {
    const stages = document.querySelectorAll('.timeline-stage');
    const stageNames = ['Requester', 'Categorization', 'Design Engineer', 'Engineer Reviewer', 'Engineer Approver', 'Customer Approval'];
    
    stages.forEach((stage, index) => {
        const stageName = stageNames[index];
        const stageNode = stage.querySelector('.stage-node i');
        
        // Remove all classes
        stage.classList.remove('completed', 'current', 'pending');
        stageNode.className = '';
        
        if (index < stageNames.indexOf(currentStage)) {
            // Completed stages
            stage.classList.add('completed');
            stageNode.className = 'fas fa-check';
        } else if (index === stageNames.indexOf(currentStage)) {
            // Current stage
            stage.classList.add('current');
            stageNode.className = 'fas fa-clock';
        } else {
            // Pending stages
            stage.classList.add('pending');
            stageNode.className = 'fas fa-circle';
        }
    });
}

// Update timeline dates with both actual and expected dates
function updateTimelineDates(caseItem) {
    const stages = document.querySelectorAll('.timeline-stage');
    const stageNames = ['Requester', 'Categorization', 'Design Engineer', 'Engineer Reviewer', 'Engineer Approver', 'Customer Approval'];
    
    stages.forEach((stage, index) => {
        const stageName = stageNames[index];
        const dateElement = stage.querySelector('.stage-date');
        
        if (dateElement) {
            let actualDate = '';
            let expectedDate = '';
            
            // Get actual and expected dates based on stage
            switch (stageName) {
                case 'Requester':
                    actualDate = caseItem.openDate;
                    expectedDate = caseItem.openDate; // Same as open date
                    break;
                case 'Categorization':
                    actualDate = caseItem.categorizationActual;
                    expectedDate = caseItem.categorization;
                    break;
                case 'Design Engineer':
                    actualDate = caseItem.designEngineerActual;
                    expectedDate = caseItem.designEngineer;
                    break;
                case 'Engineer Reviewer':
                    actualDate = caseItem.engineerReviewerActual;
                    expectedDate = caseItem.engineerReviewer;
                    break;
                case 'Engineer Approver':
                    actualDate = caseItem.engineerApproverActual;
                    expectedDate = caseItem.engineerApprover;
                    break;
                case 'Customer Approval':
                    actualDate = caseItem.customerApprovalActual;
                    expectedDate = caseItem.customerApproval;
                    break;
            }
            
            // Format dates for display
            const formatDate = (dateStr) => {
                if (!dateStr || dateStr === 'null') return '';
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return '';
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'short', 
                    day: 'numeric' 
                });
            };
            
            const actualFormatted = formatDate(actualDate);
            const expectedFormatted = formatDate(expectedDate);
            
            // Display both dates if available
            if (actualFormatted && expectedFormatted) {
                dateElement.innerHTML = `
                    <div class="actual-date">${actualFormatted}</div>
                    <div class="expected-date">${expectedFormatted}</div>
                `;
            } else if (actualFormatted) {
                dateElement.innerHTML = `<div class="actual-date">${actualFormatted}</div>`;
            } else if (expectedFormatted) {
                dateElement.innerHTML = `<div class="expected-date">${expectedFormatted}</div>`;
            } else {
                dateElement.innerHTML = '';
            }
        }
    });
}

// Show stage info on hover
    function showStageInfo(stageName) {
        const stageInfo = {
        'Requester': { description: 'Initial request submission and validation', duration: '1-2 days' },
            'Categorization': { description: 'Request classification and routing', duration: '1 day' },
        'Design Engineer': { description: 'Engineering design and analysis', duration: '3-5 days' },
        'Engineer Reviewer': { description: 'Technical review process', duration: '2-3 days' },
        'Engineer Approver': { description: 'Final approval stage', duration: '1-2 days' },
        'Customer Approval': { description: 'Customer review and feedback', duration: '2-4 days' }
        };

        const info = stageInfo[stageName];
        if (info) {
        // You can implement tooltip or modal to show this info
        console.log(`${stageName}: ${info.description} (${info.duration})`);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, checking for floating chatbot...');
    
    // Test if floating chatbot exists
    const floatingChatbot = document.getElementById('floating-chatbot');
    if (floatingChatbot) {
        console.log('✅ Floating chatbot found!');
        console.log('Floating chatbot styles:', window.getComputedStyle(floatingChatbot));
    } else {
        console.error('❌ Floating chatbot not found!');
    }
    
    // Show critical alert modal on page load
    const criticalAlertModal = new bootstrap.Modal(document.getElementById('criticalAlertModal'));
    criticalAlertModal.show();
    
    // Load data when page loads
    loadCasesData();
    
    // Tab change event to reset pagination
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target').substring(1);
            if (paginationState[targetId]) {
                // Reset to first page when switching tabs
                paginationState[targetId].currentPage = 1;
                initializePagination(targetId);
            }
        });
    });
    
    // Add hover events for timeline stages
    document.querySelectorAll('.timeline-stage').forEach(stage => {
        stage.addEventListener('mouseenter', function() {
            const stageTitle = this.querySelector('.stage-title').textContent;
            showStageInfo(stageTitle);
        });
    });

    // Initialize chatbot functionality
    initializeChatbot();
});

// Chatbot functionality
function initializeChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const floatingChatbot = document.getElementById('floating-chatbot');
    const minimizeBtn = document.getElementById('minimize-btn');
    const maximizeBtn = document.getElementById('maximize-btn');
    const closeBtn = document.getElementById('close-btn');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Debug: Check if maximize button is found
    console.log('Maximize button found:', !!maximizeBtn);
    if (maximizeBtn) {
        console.log('Maximize button styles:', window.getComputedStyle(maximizeBtn));
    }

    let isMaximized = false;

    // Ensure floating chatbot is visible by default
    if (floatingChatbot) {
        floatingChatbot.style.display = 'flex';
        console.log('Floating chatbot should be visible now');
        
        // Test click functionality
        floatingChatbot.addEventListener('click', function() {
            console.log('Floating chatbot clicked!');
        });
    } else {
        console.error('Floating chatbot element not found!');
    }

    // Show chatbot when floating icon is clicked
    floatingChatbot.addEventListener('click', function() {
        chatbotContainer.style.display = 'flex';
        floatingChatbot.style.display = 'none';
        chatInput.focus();
    });

    // Minimize chatbot (return to floating icon)
    minimizeBtn.addEventListener('click', function() {
        chatbotContainer.style.display = 'none';
        floatingChatbot.style.display = 'flex';
    });

    // Toggle maximize/minimize size
    function toggleMaximize() {
        console.log('Toggle maximize called, current state:', isMaximized);
        if (isMaximized) {
            chatbotContainer.classList.remove('maximized');
            minimizeBtn.style.display = 'block';
            maximizeBtn.style.display = 'block';
            isMaximized = false;
            console.log('Chatbot minimized');
        } else {
            chatbotContainer.classList.add('maximized');
            minimizeBtn.style.display = 'none';
            maximizeBtn.style.display = 'block';
            isMaximized = true;
            console.log('Chatbot maximized');
        }
    }

    // Maximize button click
    maximizeBtn.addEventListener('click', toggleMaximize);

    // Double click header to toggle maximize
    document.getElementById('chatbot-header').addEventListener('dblclick', toggleMaximize);

    // Close chatbot (return to floating icon)
    closeBtn.addEventListener('click', function() {
        chatbotContainer.style.display = 'none';
        floatingChatbot.style.display = 'flex';
    });

    // Send message functionality
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            sendBtn.disabled = true;
            
            // Simulate bot response
            setTimeout(() => {
                addBotMessage(getBotResponse(message));
            }, 1000);
        }
    }

    // Send button click
    sendBtn.addEventListener('click', sendMessage);

    // Enter key to send
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Enable/disable send button based on input
    chatInput.addEventListener('input', function() {
        sendBtn.disabled = !this.value.trim();
    });

    // Add user message to chat
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add bot message to chat
    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get current time
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Bot response logic
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm here to help you with DR-related questions. How can I assist you today?";
        } else if (lowerMessage.includes('dr') && lowerMessage.includes('assessment')) {
            return "I can help you with DR assessment. Please provide the case number or ESN for the specific DR you'd like me to assess.";
        } else if (lowerMessage.includes('esm') || lowerMessage.includes('engine')) {
            return "For ESM queries, I can help you find information about engine models, specifications, and related data. What specific ESM information do you need?";
        } else if (lowerMessage.includes('exception') || lowerMessage.includes('list')) {
            return "I can help you check the exception list. Please provide the part number or case details you'd like me to verify.";
        } else if (lowerMessage.includes('history') || lowerMessage.includes('previous')) {
            return "I can help you find historical DR data. Please specify the time period or case criteria you're looking for.";
        } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
            return "I'm here to help! You can ask me about:\n• DR assessments and status\n• ESM queries\n• Exception list checks\n• Historical DR data\n• General DR process questions";
        } else {
            return "I understand you're asking about: '" + message + "'. Let me help you with that. Could you provide more specific details about what you need assistance with?";
        }
    }

    // Initialize send button state
    sendBtn.disabled = true;
} 