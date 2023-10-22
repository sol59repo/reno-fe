import ZoomMtgEmbedded from "@zoomus/websdk/embedded";
const rootElement: HTMLElement = document.getElementById(
  "ZoomEmbeddedApp"
) as HTMLElement;

declare global {
  interface Window {
    testTool: any;
  }
}
const testTool = window.testTool;
// get meeting args from url
const tmpArgs = testTool.parseQuery();
const meetingConfig = {
  apiKey: tmpArgs.apiKey,
  meetingNumber: tmpArgs.mn,
  userName: (function() {
    if (tmpArgs.name) {
      try {
        return testTool.b64DecodeUnicode(tmpArgs.name);
      } catch (e) {
        return tmpArgs.name;
      }
    }
    return (
      "CDN#" +
      tmpArgs.version +
      "#" +
      testTool.detectOS() +
      "#" +
      testTool.getBrowserInfo()
    );
  })(),
  password: tmpArgs.pwd,
  leaveUrl: "/index.html",
  role: parseInt(tmpArgs.role, 10),
  userEmail: (function() {
    try {
      return testTool.b64DecodeUnicode(tmpArgs.email);
    } catch (e) {
      return tmpArgs.email;
    }
  })(),
  lang: tmpArgs.lang,
  signature: tmpArgs.signature || "",
  china: tmpArgs.china === "1",
  webEndpoint: "zoom.us"
};

if (meetingConfig.signature) {
  window.location.href = "./nav.html";
} else {
  const zmClient = ZoomMtgEmbedded.createClient();

  const tmpPort = window.location.port === "" ? "" : ":" + window.location.port;
  const avLibUrl =
    window.location.protocol +
    "//" +
    window.location.hostname +
    tmpPort +
    "/lib";

  zmClient
    .init({
      debug: true,
      zoomAppRoot: rootElement,
      assetPath: avLibUrl,
      language: meetingConfig.lang
    })
    .then((e: any) => {
      console.log("init success", e);
    })
    .catch((e: any) => {
      console.log("init error", e);
    });

  // WebSDK Embedded join
  zmClient
    .join({
      apiKey: "EXBI9itzQBO-826YW5db4w",
      signature: "RVhCSTlpdHpRQk8tODI2WVc1ZGI0dy44MTA2NDk5MDcwLjE2NDczMzg2NzEzMDMuMS5ieVJibG0wVXVlOXJtVmE3RVhGQlY0SmdsdkFKSVdqcXZJWHNRbHRPaFRZPQ==",
      meetingNumber: "8106499070",
      userName: "test test",
      password: "xe81qg",
      userEmail: "geviepitogo@gmail.com"
    })
    .then((e: any) => {
      console.log("join success", e);
    })
    .catch((e: any) => {
      console.log("join error", e);
    });
}
