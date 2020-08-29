import {StyleSheet, Dimensions} from 'react-native';

const PRIMARY_COLOR = '#C182D3';
const SECONDARY_COLOR = '#7A3FE1';
const WHITE = '#FFFFFF';
const GRAY = '#757E90';
const DARK_GRAY = '#363636';
const BLACK = '#000000';
const CONTAINER_BACKGROUND = '#F6F6F6';

const ONLINE_STATUS = '#46A575';
const OFFLINE_STATUS = '#D04949';

const STAR_ACTIONS = '#FFA200';
const LIKE_ACTIONS = '#B644B2';
const DISLIKE_ACTIONS = '#363636';
const FLASH_ACTIONS = '#5028D7';

const ICON_FONT = 'tinderclone';

const INPUT_BOX_HEIGHT = 40;

const DIMENSION_WIDTH = Dimensions.get('window').width;
const DIMENSION_HEIGHT = Dimensions.get('window').height;

const DIMENSION_WIDTH_SCREEN = Dimensions.get('screen').width;
const DIMENSION_HEIGHT_SCREEN = Dimensions.get('screen').width;

export default StyleSheet.create({
  ScrollViewContainer: {
    backgroundColor: WHITE,
  },
  ScrollViewContainerColored: {
    backgroundColor: CONTAINER_BACKGROUND,
  },
  Container: {
    backgroundColor: WHITE,
    flex: 1,
  },
  ContainerColored: {
    backgroundColor: CONTAINER_BACKGROUND,
    flex: 1,
  },
  CenterContainerWithMarginTop: {
    // justifyContent: 'center',
    marginTop: DIMENSION_HEIGHT / 15,
    alignItems: 'center',
    flex: 1,
    width: '100%',
    padding: 0,
  },
  CenterContainer: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
    padding: 0,
  },
  CenterContainerWithMarginTopTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Semi-bold ',
  },
  CenterContainerWithMarginTopSecondTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-ExtraLight',
  },
  ContainerBottomRow: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 30,
  },
  BottomOutlineButton: {
    padding: 5,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 10,
    width: 150,
    color: SECONDARY_COLOR,
  },
  BottomRowText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 18,
    color: SECONDARY_COLOR,
    fontFamily: 'Poppins-Medium',
  },
  //--------------------------------------
  FF_Thin: {
    fontFamily: 'Poppins-Thin',
  },
  FF_ExtraLight: {
    fontFamily: 'Poppins-ExtraLight',
  },
  FF_Light: {
    fontFamily: 'Poppins-Light',
  },
  // FF_Regular: {
  //   fontFamily: 'Poppins-Regular',
  // },
  FF_Medium: {
    fontFamily: 'Poppins-Medium',
  },
  FF_SemiBold: {
    fontFamily: 'Poppins-SemiBold',
  },
  FF_Bold: {
    fontFamily: 'Poppins-Bold',
  },
  FF_ExtraBold: {
    fontFamily: 'Poppins-ExtraBold',
  },
  FS_12: {
    fontSize: 12,
  },
  FS_14: {
    fontSize: 14,
  },
  FS_16: {
    fontSize: 16,
  },
  FS_18: {
    fontSize: 18,
  },
  FS_20: {
    fontSize: 20,
  },
  FS_22: {
    fontSize: 22,
  },
  FS_24: {
    fontSize: 24,
  },
  Text_Center: {
    textAlign: 'center',
  },
  Justify_Center: {
    justifyContent: 'center',
  },
  TextColorPrimary: {
    color: PRIMARY_COLOR,
  },
  //--------------------------------------
  BottomMargin_10: {
    marginBottom: 10,
  },
  BottomMargin_20: {
    marginBottom: 20,
  },
  BottomMargin_30: {
    marginBottom: 30,
  },
  TopMargin_10: {
    marginTop: 10,
  },
  TopMargin_20: {
    marginTop: 20,
  },
  TopMargin_30: {
    marginTop: 30,
  },
  RightMargin_10: {
    marginRight: 10,
  },
  LeftMargin_10: {
    marginLeft: 10,
  },
  RightMargin_20: {
    marginRight: 20,
  },
  LeftMargin_20: {
    marginLeft: 20,
  },
  LeftAndRightMargin_10: {
    marginRight: 10,
    marginLeft: 10,
  },
  LeftAndRightMargin_20: {
    marginRight: 20,
    marginLeft: 20,
  },
  LeftAndRightMargin_30: {
    marginRight: 30,
    marginLeft: 30,
  },
  //-----------------------------------
  CurveSVGTitle: {
    marginTop: 70,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: WHITE,
  },
  CurveSVGTitle_2: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: WHITE,
  },
  FullButton: {
    width: DIMENSION_WIDTH_SCREEN - 120,
    borderRadius: 30,
  },
  FullButton_2: {
    width: DIMENSION_WIDTH_SCREEN - 80,
    borderRadius: 30,
  },
  FullButtonContent: {
    // paddingTop: 6,
    // paddingBottom: 6,
  },
  FullButtonContent_2: {
    paddingTop: 1,
    paddingBottom: 1,
  },
  //--------------------------------------
  CardContainer: {
    width: DIMENSION_WIDTH_SCREEN - 70,
    backgroundColor: WHITE,
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
  CardContainer2: {
    width: DIMENSION_WIDTH_SCREEN - 70,
    backgroundColor: WHITE,
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  CardContainer3: {
    width: DIMENSION_WIDTH_SCREEN / 2.5,
    backgroundColor: WHITE,
    padding: 20,
    marginBottom: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  CartFloatingTitle: {
    // backgroundColor: PRIMARY_COLOR,
    borderRadius: 50,
    padding: 4,
    width: DIMENSION_WIDTH - 270,
    marginTop: -35,
    justifyContent: 'center',
  },
  FloatingTitleColor_1: {
    backgroundColor: PRIMARY_COLOR,
  },
  CardRedBorder: {
    borderColor: '#ff8080',
    borderWidth: 1,
  },
  CardGreenBorder: {
    borderColor: '#00ad43',
    borderWidth: 1,
  },
  //-------------------------------------
  EnterPhoneNumerInputOne: {
    width: 50,
    height: INPUT_BOX_HEIGHT,
  },
  EnterPhoneNumerInputTwo: {
    marginLeft: 15,
    width: DIMENSION_WIDTH - 175,
    height: INPUT_BOX_HEIGHT,
  },
  SubmitButton: {
    width: DIMENSION_WIDTH_SCREEN - 120,
    borderRadius: 30,
  },
  //-------------------------------------
  InputBox: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  InputFullWidth: {
    width: DIMENSION_WIDTH_SCREEN - 40,
    height: INPUT_BOX_HEIGHT,
    borderRadius: 10,
  },
  GroupButtonBox: {
    marginLeft: 10,
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  //INPUT style---------------------------
  immContainer: {
    backgroundColor: WHITE,
  },
  immInnerContainer: {
    flex: 1,
    margin: 5,
  },
  immFormTitleBox: {
    width: window.width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  immFormTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    // marginTop:20
  },
  immInputBox: {
    width: window.width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  immIconSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  immIcon: {
    color: '#bdbdbd',
    lineHeight: 25,
  },
  immInputSection: {
    flex: 5,
  },

  immDropdownBox: {
    width: window.width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  immDropdownIconSection: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  immDropdownSection: {
    flex: 5,
    marginTop: 10,
  },
  immDropdown: {
    borderWidth: 3.5,
    borderColor: 'purple',
    // borderRadius: 8,
  },
  immButtonBox: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  immBtn_full: {
    backgroundColor: '#8c499c',
    borderRadius: 25,
    width: Dimensions.get('window').width - 60,
  },
  immButtonHalfBox: {
    width: Dimensions.get('window').width / 2,
  },
  immBtn_half: {
    width: Dimensions.get('window').width / 2 - 30,
    backgroundColor: '#8c499c',
    borderRadius: 25,
    // marginLeft:30,
    // marginRight:30
  },
  immInputLabel: {
    color: '#443266',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
    paddingTop: 7,
  },
  immInputLabelBox: {
    width: window.width,
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
  },
  //INPUT style---------------------------
  TermsText: {
    textDecorationLine: 'underline',
    color: '#00ff',
  },
  RegisterFormSubmitButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 5,
    width: Dimensions.get('window').width - 60,
  },
  RegisterFormSubmitButton_2: {
    borderRadius: 5,
    width: Dimensions.get('window').width - 60,
  },
  ProfileImage: {
    // borderColor: BLACK,
    borderRadius: 85,
    borderWidth: 3,
    height: 100,
    width: 100,
    backgroundColor: WHITE,
  },
  ProfileImage_2: {
    // borderColor: BLACK,
    borderRadius: 85,
    borderWidth: 3,
    height: 80,
    width: 80,
    backgroundColor: WHITE,
  },
  ProfileCureveTitle: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: WHITE,
  },
  containerProfileItem: {
    backgroundColor: WHITE,
    paddingHorizontal: 10,
    paddingBottom: 25,
    margin: 20,
    borderRadius: 8,
    marginTop: -65,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {height: 0, width: 0},
  },
  info: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconProfile: {
    fontFamily: ICON_FONT,
    fontSize: 12,
    color: DARK_GRAY,
    paddingHorizontal: 10,
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: WHITE,
  },
  header_2: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: WHITE,
  },
  //---------------
  TabContainer: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
    padding: 0,
  },
  DashboardCard: {
    // width: DIMENSION_WIDTH_SCREEN - 70,
    backgroundColor: WHITE,
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  ListItemContainer: {
    width: DIMENSION_WIDTH_SCREEN - 50,
    backgroundColor: WHITE,
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  ListItemContainer_2: {
    width: DIMENSION_WIDTH_SCREEN - 50,
    backgroundColor: WHITE,
    padding: 8,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  ListItemDot: {
    height: 50,
    width: 50,
    // backgroundColor: '#26a69a',
    // color: '#ffffff',
    borderRadius: 50,
    padding: 3,
    margin: 5,
  },
  VaccineListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  VaccineListText: {
    fontSize: 16,
  },
  VaccineListMoreInfo: {
    fontSize: 12,
  },
  RightCircleContainer: {
    flexDirection: 'row-reverse',
    margin: 5,
  },
  PatinetnProfileInfo: {
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  PatinetProfileIcon: {
    fontFamily: ICON_FONT,
    fontSize: 12,
    color: DARK_GRAY,
    paddingHorizontal: 10,
  },
  PatientProfileCircleButton: {
    height: 50,
    width: 50,
    backgroundColor: PRIMARY_COLOR,
    // color: '#ffffff',
    borderRadius: 50,
    padding: 3,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ListDotStyle: {
    height: 50,
    width: 50,
    backgroundColor: '#26a69a',
    color: '#ffffff',
    borderRadius: 50,
    padding: 3,
    margin: 5,
  },
  ListDotText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  DotNumber: {
    fontSize: 22,
  },
  RightTextContainer: {
    height: 25,
    flexDirection: 'row-reverse',
  },
  ListRightSideText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: GRAY,
  },
  //USER---------------
  RoundButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 85,
    height: 70,
    width: 70,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  RoundButtonImage: {
    borderRadius: 85,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  RoundButtonText: {
    marginTop: 13,
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
  },
  RoundButton_2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 85,
    // height: 70,
    // width: 70,
    // shadowColor: BLACK,
    // shadowOffset: {
    //   width: 0,
    //   height: 12,
    // },
    // shadowOpacity: 0.58,
    // shadowRadius: 16.0,
    // elevation: 24,
  },
  RoundButtonImage_2: {
    borderRadius: 70,
    borderWidth: 3,
    height: 50,
    width: 50,
    marginRight: 5,
    marginLeft: 5,
  },
  RoundButtonText_2: {
    marginTop: 5,
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 5,
  },
  chip: {
    backgroundColor: GRAY,
    margin: 4,
  },
  chipText: {
    color: '#ffffff',
  },
  Sponsored_Container: {
    backgroundColor: '#fff4d6',
    padding: 4,
    marginLeft: -20,
    width: 100,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  Sponsored_Text: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#e9bc49',
  },
  CollapsHeaderStyle: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    borderBottomColor: '#efefef',
    borderBottomWidth: 2,
  },
  CollapsBodyButton: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 7,
    borderRadius: 10,
    margin: 5,
    borderColor: '#c9c9c9',
    borderWidth: 0.5,
  },
});
