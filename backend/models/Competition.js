// models/Competition.js
module.exports = (sequelize, DataTypes) => {
  const Competition = sequelize.define("Competition", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY, // E.g., '2023-11-20'
      allowNull: true,
    },
    categories: {
      type: DataTypes.JSON, // E.g., ["Design", "Presentation", "Execution"]
      allowNull: false,
      defaultValue: [],
      get() {
        const raw = this.getDataValue('categories');
        if (!raw) return [];
        if (typeof raw === 'string') {
          try {
            return JSON.parse(raw);
          } catch (e) {
            return [];
          }
        }
        return raw;
      },
      set(val) {
        if (typeof val === 'string') {
          try {
            this.setDataValue('categories', JSON.parse(val));
          } catch (e) {
            this.setDataValue('categories', val);
          }
        } else {
          this.setDataValue('categories', val);
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    feedbackReleased: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Competition;
};
