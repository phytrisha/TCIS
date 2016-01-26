var minLim = 60;
var maxLim = 180;

var tangible = false;

var centerX;
var centerY;

var initAngle = true;
var initPos = true;

var gestureSuccess = false;

var posStart = [2];
var menuActivePoint;
var menuStep = 20;
var rotationMultiplier;

var leftColdMeter;
var leftHotMeter;

var rightColdMeter;
var rightHotMeter;

var currentRotationAngle;
var lastRotationAngle;

var klimaArea=false;
var multimediaArea=false;
var albumOverview=false;
var artistOverview=false;

var leftKlimaZone = false;
var rightKlimaZone = false;

var albumDetail = false;

var tempMax = 28;
var tempMin = 15;
var standardTemp=(tempMin+tempMax)/2;

var leftTemperatureZoneOutput = standardTemp;
var leftTemperatureZoneVariable = standardTemp;

var rightTemperatureZoneOutput = standardTemp;
var rightTemperatureZoneVariable = standardTemp;

var multimediaScrollYPos;
var multimediaScrollYReferencePos;

var albumDetailScrollYPos;
var albumDetailScrollYReferencePos;

var updateScroll=false;

var currentScrollYPos;
var referenceScrollYPos;

var captureStartScroll=true;

var lastScrollYPos;
var lastScrollYSpeed;

var scrollingEvent = false;
var touchEvent = false;

var rotationStep = 0.02;

var leftBorder = [2];
var rightBorder = [2];

var readyForTouch = false;

var readyForAlbumDetail = false;

var endTouch;

var menuLeftOpen = false;
var menuRightOpen = false;

var menuPlaybackOpen = false;

var albumName = [];
var albumArtist = [];
var songs = [];
var songLengths = [];

var artists = [];

var currentY;
var startY;
var getTouch;

var currentAlbum;
var scrollHeight;

var currentVolume = 140;
var startVolume;
