// models/Score.js
module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define("Score", {
    scores: {
      type: DataTypes.JSON, // E.g. {"Design": 10, "Presentation": 8}
      allowNull: false,
      get() {
        const raw = this.getDataValue('scores');
        if (!raw) return {};
        if (typeof raw === 'string') {
          try {
            return JSON.parse(raw);
          } catch (e) {
            return {};
          }
        }
        return raw;
      },
      set(val) {
        if (typeof val === 'string') {
          try {
            this.setDataValue('scores', JSON.parse(val));
          } catch (e) {
            this.setDataValue('scores', val);
          }
        } else {
          this.setDataValue('scores', val);
        }
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });

  return Score;
};
