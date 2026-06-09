const https = require('https'); // HTTPS module for making secure requests
const express = require("express"); // Express web framework
const swaggerUi = require("swagger-ui-express"); // Swagger UI middleware
const YAML = require('yamljs'); // YAML parser for Swagger
const apiBackoffice = require("./router/backoffice"); // Backoffice routes
const apiKiosk = require("./router/kiosk"); // Kiosk routes
const app = express(); // Create Express app
const cors = require("cors"); // CORS middleware
const xmlparser = require('express-xml-bodyparser');
const fs = require('fs');
const path = require('path');

require("dotenv").config(); // Load environment variables

// Use the XML body parser middleware
app.use(xmlparser());

const options = {
  key: fs.readFileSync(path.join(__dirname, 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certificate.crt'))
};


const swaggerDocument = YAML.load('./API_KIOSK_System.yml');

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json()); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", apiBackoffice);
app.use("/api-kiosk", apiKiosk);

const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

const axios = require('axios');

app.get("/apitest", async (req, res) => {

    await axios.get('https://api.thecatapi.com/v1/images/search')

    .then(response => {
        // console.log(response.data);
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);

        // console.log(date.format(new Date(), "YYYY-MM-DD"));
        // res.json({ message: response.data });

        res.send(
// `<?xml version="1.0" encoding="UTF-8" ?>
`
<?xml version="1.0" encoding="UTF-8" ?>
<framed_ip_address>192.168.203.60</framed_ip_address>
<auth_acs_timestamp>2025-09-02T12:00:00.405+07:00</auth_acs_timestamp>
<framed_ip_address>192.168.203.60</framed_ip_address>
<auth_acs_timestamp>2025-09-02T12:00:00.405+07:00</auth_acs_timestamp>
`
// <ns3:searchResult total="1" xmlns:ns5="ers.ise.cisco.com" xmlns:ers-v2="res-v2" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:ns3="v2.ers.ise.cisco.com">
//     <ns3:resources>
//         <ns5:resource>

//             <ns5:resource description="Default" id="3b422b21-90f1-49d5-a3b2-c1b1b71cf933" name="Sponsor Portal">
//                 <link href="https://api.thecatapi.com/v1/images/search/3b422b21-90f1-49d5-a3b2-c1b1b71cf933"></link>
//             </ns5:resource>

//         </ns5:resource>
//     </ns3:resources>
// </ns3:searchResult> 
// <ns3:searchResult total="1" xmlns:ns5="ers.ise.cisco.com" xmlns:ers-v2="res-v2" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:ns3="v2.ers.ise.cisco.com">
//     <ns3:resources>
//         <ns5:resource>

//             <ns5:resource description="Default" id="3b422b21-90f1-49d5-a3b2-c1b1b71cf98985656" name="Sponsor Portal">
//                 <link href="https://api.thecatapi.com/v1/images/search/3b422b21-90f1-49d5-a3b2-c1b1b71cf933"></link>
//             </ns5:resource>

//         </ns5:resource>
//     </ns3:resources>
// </ns3:searchResult>`
            );
    })
    .catch(error => {
        res.json({ message: error });
        console.log(error);
    });
});

app.get("/apitestxml", async (req, res) => {

    await axios.get('http://localhost:5002/apitest')
    .then(response => {

        console.log(response.data);

        // const currentDate = new Date();
        // currentDate.setDate(currentDate.getDate() + 1);

        const regex = /<framed_ip_address>(.*?)<\/framed_ip_address>[\s\S]*?<auth_acs_timestamp>(.*?)<\/auth_acs_timestamp>/g;
        const resultArray = [];
        let match;

        while ((match = regex.exec(response.data)) !== null) {
            resultArray.push({
                "framed_ip_address": match[1],
                "auth_acs_timestamp": match[2]
            });
        }

        const result = resultArray;
        
        res.send({
            "result": result,

        })
        // console.log();

        // parser.parseString(response.data, (err, result) => {

        //     if (err) {
        //         console.error('Error parsing XML:', err);
        //         return;
        //     }

        //     console.log(result);

        //     // Access the id
        //     // const id = result.framed_ip_address;

        //     // const result.auth_acs_timestamp;

        //     // console.log(id);
        //     // Output: 3b422b21-90f1-49d5-a3b2-c1b1b71cf933
        //     res.send({
        //         result: result
        //     })
        // });
    })
    .catch(error => {
        res.json({ message: error });
        console.log(error);
    });
});

app.get("/apitestxmlget", async (req, res) => {

    console.log(req.body);

    res.send(req.body);
});

app.get("/apitestxmlConvert", async (req, res) => {

    const xmlData = `
<?xml version="1.0" encoding="UTF-8"?>
<sessionParameters>
   <passed xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:boolean">true</passed>
   <failed xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:boolean">false</failed>
   <user_name>zoo26680001</user_name>
   <nas_ip_address>10.10.98.1</nas_ip_address>
   <calling_station_id>28:D0:43:E9:C8:61</calling_station_id>
   <orig_calling_station_id>28-d0-43-e9-c8-61</orig_calling_station_id>
   <cpmsession_id>01620A0A0000006DA6DBCEBC</cpmsession_id>
   <destination_ip_address>10.10.13.10</destination_ip_address>
   <device_ip_address>10.10.98.1</device_ip_address>
   <identity_group>User Identity Groups:GuestType_Daily (default),Unknown</identity_group>
   <network_device_name>DC1-WLC</network_device_name>
   <acs_server>dc1-ise-nac-01</acs_server>
   <authentication_method>Authorize Only</authentication_method>
   <framed_ip_address>10.100.168.54</framed_ip_address>
   <auth_acs_timestamp>2026-06-08T17:54:13.517+07:00</auth_acs_timestamp>
   <execution_steps>11001,11017,11027,15049,15008,15036,24209,24211,15016,24209,24211,11002</execution_steps>
   <response>{User-Name=zoo26680001; Class=CACS:01620A0A0000006DA6DBCEBC:dc1-ise-nac-01/569956564/472; Session-Timeout=108290; Termination-Action=Default; cisco-av-pair=cts:security-group-tag=0006-00; cisco-av-pair=profile-name=Unknown; LicenseTypes=1; }</response>
   <audit_session_id>01620A0A0000006DA6DBCEBC</audit_session_id>
   <nas_port_id>capwap_9100000e</nas_port_id>
   <posture_status />
   <selected_azn_profiles>PermitAccess</selected_azn_profiles>
   <service_type>Authorize Only</service_type>
   <message_code>5236</message_code>
   <auth_acsview_timestamp>2026-06-08T17:54:13.517+07:00</auth_acsview_timestamp>
   <auth_id>1780582163696212</auth_id>
   <identity_store>Guest Users</identity_store>
   <cts_security_group>Guests</cts_security_group>
   <location>All Locations</location>
   <device_type>All Device Types</device_type>
   <response_time>11</response_time>
   <framed_ipv6_address>
      <ipv6_address />
      <ipv6_address>fe80::6da1:27aa:830:5e56</ipv6_address>
   </framed_ipv6_address>
   <other_attr_string>:!:ConfigVersionId=80:!:DestinationPort=1812:!:Protocol=Radius:!:NAS-Port=9815:!:Framed-MTU=1485:!:EAP-Key-Name=:!:OriginalUserName=28d043e9c861:!:NetworkDeviceProfileId=b0699505-3150-4215-a80e-6753d45bf56c:!:IsThirdPartyDeviceFlow=false:!:AcsSessionID=dc1-ise-nac-01/569956564/472:!:AuthorizationPolicyMatchedRule=WiFi_Guest_Access_Daily:!:EndPointMACAddress=28-D0-43-E9-C8-61:!:ISEPolicySetName=Guest:!:StepLatency=1=0;2=0;3=0;4=0;5=3;6=0;7=2;8=1;9=1;10=3;11=0:!:TotalAuthenLatency=11:!:ClientLatency=0:!:DTLSSupport=Unknown:!:HostIdentityGroup=Endpoint Identity Groups:Unknown:!:Network Device Profile=Cisco:!:Location=Location#All Locations:!:Device Type=Device Type#All Device Types:!:IPSEC=IPSEC#Is IPSEC Device#No:!:Name=User Identity Groups:GuestType_Daily (default):!:Name=Endpoint Identity Groups:Unknown:!:RADIUS Username=28:D0:43:E9:C8:61:!:NAS-Identifier=DC1-WLC-01:!:Device IP Address=10.10.98.1:!:CPMSessionID=01620A0A0000006DA6DBCEBC:!:Called-Station-ID=58-df-59-de-22-20:Zoo_Guest:!:CiscoAVPair=service-type=Call Check,audit-session-id=01620A0A0000006DA6DBCEBC,method=mab,addrv6=fe80::6da1:27aa:830:5e56,client-iif-id=1543504509,vlan-id=290,cisco-wlan-ssid=Zoo_Guest,wlan-profile-name=Zoo_Guest,AuthenticationIdentityStore=Guest Users:!:UseCase=Guest Flow</other_attr_string>
   <acct_id>1780582163696214</acct_id>
   <acct_acs_timestamp>2026-06-08T17:54:13.527+07:00</acct_acs_timestamp>
   <acct_acsview_timestamp>2026-06-08T17:54:13.527+07:00</acct_acsview_timestamp>
   <acct_session_id>00003eba</acct_session_id>
   <acct_status_type>Start</acct_status_type>
   <acct_input_octets>0</acct_input_octets>
   <acct_output_octets>0</acct_output_octets>
   <acct_input_packets>0</acct_input_packets>
   <acct_output_packets>0</acct_output_packets>
   <acct_authentic>Remote</acct_authentic>
   <acct_delay_time>0</acct_delay_time>
   <event_timestamp>1780916053</event_timestamp>
   <security_group>Guests</security_group>
   <started xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:boolean">true</started>
   <stopped xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:boolean">false</stopped>
   <endpoint_policy>Unknown</endpoint_policy>
</sessionParameters>
`;

    // ตอนสั่ง parseString ให้ใส่ object { explicitArray: false } เพิ่มเข้าไปในพารามิเตอร์ตัวที่ 2
    parser.parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (err) return res.status(500).send({ error: err.message });

        const sessionParams = result.sessionParameters;

        // พอดึงรูปแบบนี้ ข้อมูลจะมาเป็นข้อความเต็มๆ ไม่โดนตัดเหลือตัวแรกแล้วครับ
        res.send({
            framed_ip_address: sessionParams?.framed_ip_address,
            auth_acs_timestamp: sessionParams?.auth_acs_timestamp
        });
    });
});

// หน้าแรก
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>POS Server Status</title>
            <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏃</text></svg>">
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>

        <body style="display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
            font-family: 
            sans-serif; 
            font-size: 2em;
        ">

            <div
                class="text-3xl font-bold  text-clifford animate-pulse duration-500"

                style="
                    background-color: #3EB776;
                    color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                ">
                
            🏃Kiosk Server is running!
            </div>
        </body>
        </html>
    `);
});

// Start the server
const port = process.env.Port;

// const server = https.createServer(options, app);

// server.listen(port, () => {
//     console.log(`🚀 Secure Server is running on https://localhost:${port}`);
// });

// server.on('error', (e) => {
//   if (e.code === 'EADDRINUSE') {
//     console.error(`❌ Error: Port ${port} is already in use by another service (likely IIS or Skype).`);
//   } else if (e.code === 'EACCES') {
//     console.error(`❌ Error: You must run Terminal as Administrator to use port ${port}.`);
//   } else {
//     console.error(e);
//   }
// });
app.listen(port, function () {
    console.log(`✅ Server is running on http://localhost:${port}`);
});