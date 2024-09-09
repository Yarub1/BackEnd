// File: src/models/EyeExam.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { encrypt, decrypt } from "../../utils/encryptionMediator.js";

const EyeExam = sequelize.define(
  "EyeExam",
  {
    patientId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Patients",
        key: "id",
      },
      allowNull: false,
    },
    rightEyeWithoutCorrection: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeWithoutCorrection", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeWithoutCorrection");
        return decrypt(rawValue);
      },
    },
    rightEyeWithCorrection: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeWithCorrection", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeWithCorrection");
        return decrypt(rawValue);
      },
    },
    rightEyePressure: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyePressure", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyePressure");
        return decrypt(rawValue);
      },
    },
    cornealShapeRightEye: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("cornealShapeRightEye", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("cornealShapeRightEye");
        return decrypt(rawValue);
      },
    },
    cornealSurfaceRightEye: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("cornealSurfaceRightEye", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("cornealSurfaceRightEye");
        return decrypt(rawValue);
      },
    },
    rightEyeRetinaExamination: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeRetinaExamination", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeRetinaExamination");
        return decrypt(rawValue);
      },
    },
    presenceOfCataractRightEye: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("presenceOfCataractRightEye", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("presenceOfCataractRightEye");
        return decrypt(rawValue);
      },
    },
    lensClarityRightEye: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("lensClarityRightEye", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("lensClarityRightEye");
        return decrypt(rawValue);
      },
    },
    rightEyeFundusExamination: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeFundusExamination", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeFundusExamination");
        return decrypt(rawValue);
      },
    },
    leftEyeWithoutCorrection: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeWithoutCorrection", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeWithoutCorrection");
        return decrypt(rawValue);
      },
    },
    leftEyeWithCorrection: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeWithCorrection", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeWithCorrection");
        return decrypt(rawValue);
      },
    },
    leftEyePressure: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyePressure", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyePressure");
        return decrypt(rawValue);
      },
    },
    cornealShapeLeftEye: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("cornealShapeLeftEye", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("cornealShapeLeftEye");
        return decrypt(rawValue);
      },
    },
    cornealSurfaceLeftEye: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("cornealSurfaceLeftEye", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("cornealSurfaceLeftEye");
        return decrypt(rawValue);
      },
    },
    leftEyeRetinaExamination: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeRetinaExamination", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeRetinaExamination");
        return decrypt(rawValue);
      },
    },
    presenceOfCataractLeftEye: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("presenceOfCataractLeftEye", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("presenceOfCataractLeftEye");
        return decrypt(rawValue);
      },
    },
    lensClarityLeftEye: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("lensClarityLeftEye", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("lensClarityLeftEye");
        return decrypt(rawValue);
      },
    },
    leftEyeFundusExamination: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeFundusExamination", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeFundusExamination");
        return decrypt(rawValue);
      },
    },
    rightEyeRefraction: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeRefraction", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeRefraction");
        return decrypt(rawValue);
      },
    },
    rightEyeSphericalPower: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeSphericalPower", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeSphericalPower");
        return decrypt(rawValue);
      },
    },
    rightEyeCylindricalPower: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeCylindricalPower", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeCylindricalPower");
        return decrypt(rawValue);
      },
    },
    rightEyeAxis: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeAxis", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeAxis");
        return decrypt(rawValue);
      },
    },
    rightEyeAdditionForReading: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeAdditionForReading", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeAdditionForReading");
        return decrypt(rawValue);
      },
    },
    rightEyeLensType: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeLensType", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeLensType");
        return decrypt(rawValue);
      },
    },
    rightEyeLensDiameter: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeLensDiameter", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeLensDiameter");
        return decrypt(rawValue);
      },
    },
    rightEyeBaseCurve: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("rightEyeBaseCurve", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("rightEyeBaseCurve");
        return decrypt(rawValue);
      },
    },
    leftEyeRefraction: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeRefraction", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeRefraction");
        return decrypt(rawValue);
      },
    },
    leftEyeSphericalPower: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeSphericalPower", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeSphericalPower");
        return decrypt(rawValue);
      },
    },
    leftEyeCylindricalPower: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeCylindricalPower", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeCylindricalPower");
        return decrypt(rawValue);
      },
    },
    leftEyeAxis: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeAxis", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeAxis");
        return decrypt(rawValue);
      },
    },
    leftEyeAdditionForReading: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeAdditionForReading", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeAdditionForReading");
        return decrypt(rawValue);
      },
    },
    leftEyeLensType: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeLensType", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeLensType");
        return decrypt(rawValue);
      },
    },
    leftEyeLensDiameter: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeLensDiameter", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeLensDiameter");
        return decrypt(rawValue);
      },
    },
    leftEyeBaseCurve: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("leftEyeBaseCurve", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("leftEyeBaseCurve");
        return decrypt(rawValue);
      },
    },
    frameType: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameType", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameType");
        return decrypt(rawValue);
      },
    },
    frameManufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameManufacturer", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameManufacturer");
        return decrypt(rawValue);
      },
    },
    frameModel: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameModel", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameModel");
        return decrypt(rawValue);
      },
    },
    frameSize: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameSize", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameSize");
        return decrypt(rawValue);
      },
    },
    frameLensWidth: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameLensWidth", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameLensWidth");
        return decrypt(rawValue);
      },
    },
    frameBridgeWidth: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameBridgeWidth", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameBridgeWidth");
        return decrypt(rawValue);
      },
    },
    frameTempleLength: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameTempleLength", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameTempleLength");
        return decrypt(rawValue);
      },
    },
    frameMaterial: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameMaterial", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameMaterial");
        return decrypt(rawValue);
      },
    },
    frameColor: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameColor", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameColor");
        return decrypt(rawValue);
      },
    },
    frameShape: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("frameShape", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("frameShape");
        return decrypt(rawValue);
      },
    },
    eyeglassesPrescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue("eyeglassesPrescription", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("eyeglassesPrescription");
        return decrypt(rawValue);
      },
    },
    contactLensesPrescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue("contactLensesPrescription", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("contactLensesPrescription");
        return decrypt(rawValue);
      },
    },
    additionalTreatments: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue("additionalTreatments", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("additionalTreatments");
        return decrypt(rawValue);
      },
    },
    followUpInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue("followUpInstructions", encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue("followUpInstructions");
        return decrypt(rawValue);
      },
    },
  },
  {
    timestamps: true,
  }
);

export default EyeExam;
