
const hubID = "b.24d2d632-e01b-4ca0-b988-385be827cb04"
const account_id = "24d2d632-e01b-4ca0-b988-385be827cb04"
const bucketKey = "wip.dm.emea.2"
const defaultFolder = "urn:adsk.wipemea:fs.folder:co.l7DHLbVaRl-XxgXi8QYFZw" // KELTBRAY - WIP Folder
let templateFolderID
let selectedOptionStartType
let uploadFileList

var AccessToken_DataCreate
var AccessToken_DataRead
var AccessToken_BucketCreate
let accessTokenDataWrite

let ProjectList =[]
let ProjectListRaw

const projectID = "2e6449f9-ce25-4a9c-8835-444cb5ea03bf"
const topFolder = "urn:adsk.wipemea:fs.folder:co.uKW9z6rSSoOFNtj4bWn7UA"
const NSID = "ab4856cc-1546-5a4b-8ff4-99e41fc97170"

let newProjectName
let subContractorsListHtml
let arraySelectedContractorArray = []; 
let access_token
let topFolderData
let createdFolders = []
let webhookFolders = []
let statusElement
let newFolderLink
let newFolderLinkBtn
let submitBtn

const folderStructure = [
  { name: "0A.INCOMING", children: [] },
  { name: "0C.WIP", children: [] },
  { name: "0D.COMMERCIAL", children: [
    { name: "CVRs", children: [] },
    { name: "Forecasts", children: [] },
    { name: "Monthly Reports", children: [] },
  ] },
  { name: "0E.SHARED", children: [] },
  { name: "0G.PUBLISHED", children: [] },
  { name: "0H.ARCHIVED", children: [] },
  {
    name: "Z.PROJECT_ADMIN",
    children: [
      {
        name: "1.Pre-contract",
        children: [
          { name: "1. ITT", children: [] },
          { name: "2. Site Visit", children: [] },
          {
            name: "3. Call Off Proposal",
            children: [
              { name: "1. KD001 Deliverables", children: [] },
              { name: "2. KD002 Programme", children: [] },
              { name: "3. KD003 Activity Schedule", children: [] },
              { name: "4. KD004 Consents Price Schedule", children: [] },
              { name: "5. KD005 Indicative Project Programme", children: [] },
              { name: "6. KD006 Risk Register", children: [] },
              { name: "7. KD007 Project Delivery Statement", children: [] },
              { name: "8. KD008 Pricing Narrative", children: [] },
              { name: "9. KD009 CD Part 2", children: [] },
              { name: "10. KD010 TQ Register", children: [] },
              { name: "11. Supply Chain", children: [] },
            ],
          },
        ],
      },
      {
        name: "2.Contract Award",
        children: [
          { name: "1. Contract Documents", children: [] },
          { name: "2. Purchase Order", children: [] },
          { name: "3. Post-tender Submission", children: [] },
        ],
      },
      {
        name: "3.Client Documents",
        children: [
          { name: "1.Meeting Minutes (Legacy only)", children: [] },
          { name: "2.Reports", children: [] },
        ],
      },
      {
        name: "4.Stakeholders",
        children: [
          { name: "1.Meeting Minutes (Legacy only)", children: [] },
          { name: "2.Reports", children: [] },
        ],
      },
      {
        name: "5.Applications",
        children: [
          { name: "1.AFP ### & Date", children: [] },
          { name: "2.AFP ### & Date", children: [] },
        ],
      },
      {
        name: "6.Programme",
        children: [
          { name: "1. Deliverability Plan", children: [] },
          { name: "2. Clause 31 Programme Pack", children: [] },
          { name: "3. Clause 32 Programme Pack", children: [] },
          { name: "4. Weekly Lookaheads", children: [] },
          { name: "5. Reports", children: [] },
        ],
      },
      {
        name: "7.HSQE",
        children: [
          {
            name: "1. CDM",
            children: [
              { name: "1. F10", children: [] },
              { name: "2. H&S File", children: [] },
              { name: "3. Letters of Appointment", children: [] },
              { name: "4. Temporary Works & Lifting", children: [] },
              { name: "5. CPP", children: [] },
              { name: "6. Emergency Response Plan", children: [] },
              { name: "7. Traffic Mgt Plan", children: [] },
              { name: "8. Environment", children: [] },
              {
                name: "9. Waste",
                children: [
                  { name: "1. SWMP", children: [] },
                  { name: "2. Waste Transfer Notes", children: [] },
                  { name: "3. Waste Carrier Licences", children: [] },
                ],
              },
            ],
          },
          { name: "2. Risk Assessments", children: [] },
          { name: "3. RAMS", children: [] },
          { name: "4. First Aid, Accidents & Incidents", children: [] },
          {
            name: "5. Site Audits & Inspections",
            children: [
              { name: "1. Keltbray", children: [] },
              { name: "2. SSE", children: [] },
              { name: "3. Subcontractors", children: [] },
            ],
          },
          {
            name: "6. Stats",
            children: [
              { name: "1. Keltbray", children: [] },
              { name: "2. SSE", children: [] },
              { name: "3. Subcontractors", children: [] },
            ],
          },
          { name: "7. Permits", children: [] },
          {
            name: "8. Plant Inspections & Certificates",
            children: [
              { name: "1.(Subcontractor Name)", children: [] },
              { name: "2.(Subcontractor Name)", children: [] },
            ],
          },
          { name: "9. COSHH", children: [] },
          {
            name: "10. Quality",
            children: [
              { name: "1.ITP", children: [] },
              { name: "2. QMP", children: [] },
              { name: "3. QA", children: [] },
            ],
          },
          { name: "11. Induction & Training", children: [] },
        ],
      },
      {
        name: "8.Change Control",
        children: [
          { name: "1.PM", children: [] },
          { name: "2.WN", children: [] },
          { name: "3.NCE", children: [] },
          { name: "4.CEO", children: [] },
          { name: "5.Implemented CE's", children: [] },
        ],
      },
      {
        name: "9.Sub-contractors",
        children: [
          {
            name: "Sub-contractor X",
            children: [
              { name: "1.Pre-contract", children: [] },
              { name: "2.Subcontract", children: [] },
              { name: "3.Payment", children: [] },
              {
                name: "4.Change Control",
                children: [
                  { name: "1.EWN's", children: [] },
                  { name: "2.PMI's", children: [] },
                  { name: "3.NCE's", children: [] },
                  { name: "4.CEQ's", children: [] },
                  { name: "5.CE's", children: [] },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "10.Materials",
        children: [
          { name: "1.Requisitions", children: [] },
          { name: "2.Material Order Numbers", children: [] },
        ],
      },
      {
        name: "11.Plant",
        children: [
          { name: "1.Requisitions", children: [] },
          { name: "2.Plant Order Numbers", children: [] },
        ],
      },
      {
        name: "12.Operations",
        children: [
          { name: "1. Kick Off Meeting", children: [] },
          { name: "2. Bi-Weekly Meetings", children: [] },
        ],
      },
      { name: "13.Risk Management", children: [] },
      {
        name: "14.Sustainability & Social Value",
        children: [
          {
            name: "1.Stakeholder Engagement",
            children: [{ name: "1.Communications", children: [] }],
          },
          {
            name: "2.Social Value",
            children: [
              { name: "1.Evidence", children: [] },
              { name: "2.Reporting", children: [] },
            ],
          },
          {
            name: "3.Environmental Sustainability",
            children: [
              { name: "1.Waste", children: [] },
              { name: "2.Carbon", children: [] },
            ],
          },
        ],
      },
    ],
  },
];

// const projectFolderStructure = [
//     {folder:"0A.INCOMING",parentFolder:"TOP_FOLDER",requireNS:"N"},
//     {folder:"0C.WIP",parentFolder:"TOP_FOLDER",requireNS:"Y"},
//     {folder:"0D.COMMERCIAL",parentFolder:"TOP_FOLDER",requireNS:"Y"},
//     {folder:"0E.SHARED",parentFolder:"TOP_FOLDER",requireNS:"Y"},
//     {folder:"0G.PUBLISHED",parentFolder:"TOP_FOLDER",requireNS:"Y"},
//     {folder:"0H.ARCHIVED",parentFolder:"TOP_FOLDER",requireNS:"N"},
//     {folder:"Z.PROJECT_ADMIN",parentFolder:"TOP_FOLDER",requireNS:"N"}
// ]

const projectWIPFolders = [
    {folder:"DAL - Dalcour",parentFolder:"0C.WIP"},
    {folder:"EXC - Excalon",parentFolder:"0C.WIP"},
    {folder:"HMF - HMF Consultants",parentFolder:"0C.WIP"},
    {folder:"KEL - Keltbray",parentFolder:"0C.WIP"},
    {folder:"WCS - Whitfield Consulting Services",parentFolder:"0C.WIP"},
    {folder:"SSE - Scottish and Southern Energy (Client)",parentFolder:"0C.WIP"},
]
const permssions =[
    {level:"FullController",actions:["PUBLISH","PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE","EDIT","CONTROL"]},
    {level:"Edit",actions:["PUBLISH","PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE","EDIT"]},
    {level:"createFull",actions:["PUBLISH","PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE"]},
    {level:"createPart",actions:["PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE"]},
    {level:"viewFull",actions:["VIEW","DOWNLOAD","COLLABORATE"]},
    {level:"viewPart",actions:["VIEW","COLLABORATE"]}
];

const folderPermissionList =[
    {folderName:"DAL - Dalcour",folderPermissions:[
        {name:"Dalcour",subjectId:"6292dbce-36c9-4582-975a-9455aebad0f7",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"EXC - Excalon",folderPermissions:[
        {name:"Excalon",subjectId:"5ddc8bb2-76b2-4427-a90d-f3a06be71894",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"HMF - HMF Consultants",folderPermissions:[
        {name:"HMF Consulting",subjectId:"4634db8e-abba-4802-ad6f-52b4c49296bc",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"KEL - Keltbray",folderPermissions:[
        {name:"Keltbray",subjectId:"6b11172f-c01a-4fde-9abe-a3a12a978861",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"WCS - Whitfield Consulting Services",folderPermissions:[
        {name:"Whitfield Consulting Services",subjectId:"4d137d0b-9a13-4fd4-8f31-e1ad493b87e1",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"SSE - Scottish and Southern Energy (Client)",folderPermissions:[
        {name:"SSE",subjectId:"d8e74e8c-4360-41d2-9bc2-97f48c02f0a8",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"0E.SHARED",folderPermissions:[
        {name:"Keltbray",subjectId:"6b11172f-c01a-4fde-9abe-a3a12a978861",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Dalcour",subjectId:"6292dbce-36c9-4582-975a-9455aebad0f7",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Excalon",subjectId:"5ddc8bb2-76b2-4427-a90d-f3a06be71894",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"HMF Consulting",subjectId:"4634db8e-abba-4802-ad6f-52b4c49296bc",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"SSE",subjectId:"d8e74e8c-4360-41d2-9bc2-97f48c02f0a8",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Whitfield Consulting Services",subjectId:"4d137d0b-9a13-4fd4-8f31-e1ad493b87e1",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
    ]},
    {folderName:"0F.CLIENT_SHARED",folderPermissions:[
        {name:"SSE",subjectId:"d8e74e8c-4360-41d2-9bc2-97f48c02f0a8",autodeskId:"",subjectType:"COMPANY",actions:"createPart"},
    ]},
    {folderName:"0G.PUBLISHED",folderPermissions:[
        {name:"Keltbray",subjectId:"6b11172f-c01a-4fde-9abe-a3a12a978861",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Dalcour",subjectId:"6292dbce-36c9-4582-975a-9455aebad0f7",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Excalon",subjectId:"5ddc8bb2-76b2-4427-a90d-f3a06be71894",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"HMF Consulting",subjectId:"4634db8e-abba-4802-ad6f-52b4c49296bc",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"SSE",subjectId:"d8e74e8c-4360-41d2-9bc2-97f48c02f0a8",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Whitfield Consulting Services",subjectId:"4d137d0b-9a13-4fd4-8f31-e1ad493b87e1",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
    ]}

]
document.addEventListener('DOMContentLoaded', function() {
    newFolderLinkBtn = document.getElementById('newFolderLinkBtn')
    submitBtn = document.getElementById('submitBtn')
    statusElement = document.getElementById('statusUpdate');
    subContractorsListHtml = document.getElementById('subContractorsList');
    renderSubContractorList(projectWIPFolders)
    newFolderLinkBtn.style.display = "none"
  });

  function renderSubContractorList(data) {
    subContractorsListHtml.innerHTML = '';

    data.forEach(function(record) {

        var gridItem = document.createElement('li');
        gridItem.innerHTML = `
                <input type="checkbox" id="${record.folder}" name="SubContractor" value="${record.folder}" />
                <label for="${record.folder}">${record.folder}</label>

          `;
          subContractorsListHtml.appendChild(gridItem);
        
      });
      $('button').on('click', function(e) {
        e.preventDefault();

        $("input:checkbox[name=SubContractor]:checked").each(function() { 
            arraySelectedContractorArray.push($(this).val()); 
        });
        if(arraySelectedContractorArray.length){
            //console.log(arraySelectedContractorArray)
        }
        
    });
}








