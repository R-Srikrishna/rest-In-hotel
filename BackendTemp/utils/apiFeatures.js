const { Op } = require('sequelize');

class APIFeatures {
  constructor(queryString = {}, options = {}) {
    this.queryString = queryString;
    this.options = options;
}

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    const where = {};

    Object.keys(queryObj).forEach((key) => {
      const value = queryObj[key];

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        where[key] = {};
        Object.keys(value).forEach((operator) => {
          const sequelizeOp = this.getOp(operator);
          if (sequelizeOp) {
            where[key][sequelizeOp] = this.parseValue(value[operator]);
          }
        });
      } else if (Array.isArray(value)) {
        where[key] = { [Op.in]: value.map((v) => this.parseValue(v)) };
      } else {
        where[key] = this.parseValue(value);
      }
    });

    this.options.where = { ...(this.options.where || {}), ...where };
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const order = this.queryString.sort.split(',').map((field) => {
        if (field.startsWith('-')) {
          return [field.slice(1), 'DESC'];
        }
        return [field, 'ASC'];
      });
      this.options.order = order;
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.options.attributes = this.queryString.fields.split(',');
    }
    return this;
  }

  paginate() {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.max(1, parseInt(this.queryString.limit, 10) || 20);
    this.options.limit = limit;
    this.options.offset = (page - 1) * limit;
    return this;
  }

  getOp(operator) {
    const operators = {
      gte: Op.gte,
      gt: Op.gt,
      lte: Op.lte,
      lt: Op.lt,
      ne: Op.ne,
      in: Op.in,
      nin: Op.notIn
    };
    return operators[operator];
  }

  parseValue(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (
      typeof value === 'string' &&
      value.trim() !== '' &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
    return value;
  }
}

module.exports = APIFeatures;
