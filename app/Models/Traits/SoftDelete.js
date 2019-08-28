/* eslint-disable func-names */

class SoftDeletes {
  register(Model, customOptions = {}) {
    const deletedAtColumn = customOptions.name || 'deleted_at';

    Model.addGlobalScope(builder => {
      builder.whereNull(`${Model.table}.${deletedAtColumn}`);
    }, 'adonis_soft_deletes');

    Model.prototype.delete = async function({ force = false } = {}) {
      await this.constructor.$hooks.before.exec('delete', this);

      if (force) {
        this.forceDelete();
      } else {
        this[deletedAtColumn] = new Date();
        await this.save();
        this.freeze();
      }

      await this.constructor.$hooks.after.exec('delete', this);
    };

    Model.prototype.restore = async function() {
      await this.constructor.$hooks.before.exec('restore', this);

      this[deletedAtColumn] = null;
      await this.save();
      this.$frozen = false;

      await this.constructor.$hooks.after.exec('restore', this);
    };

    Model.prototype.forceDelete = async function() {
      await this.ignoreScopes(['adonis_soft_deletes']).delete();
    };

    Model.queryMacro('withTrashed', function() {
      this.ignoreScopes(['adonis_soft_deletes']);
      return this;
    });

    Model.withTrashed = function() {
      return this.query().withTrashed();
    };

    Model.queryMacro('onlyTrashed', function() {
      this.ignoreScopes(['adonis_soft_deletes']);
      this.whereNotNull('deleted_at');
      return this;
    });

    Model.onlyTrashed = function() {
      return this.query().onlyTrashed();
    };

    Model.findOrFailAndRestore = async function(id) {
      const model = await Model.withTrashed()
        .where(Model.primaryKey, id)
        .firstOrFail();
      await model.restore();
      return model;
    };

    Model.findOrFailAndDelete = async function(id) {
      const model = await Model.withTrashed()
        .where(Model.primaryKey, id)
        .firstOrFail();
      await model.delete();
      return model;
    };

    /**
     * Assume that model is always in non-deleted state.
     * It's easier to work this way with models state.
     *
     * And if you wonder if that's safe, well - not really.
     */
    Object.defineProperty(Model.prototype, 'isDeleted', {
      get() {
        return false;
      }
    });

    Object.defineProperty(Model.prototype, 'isTrashed', {
      get() {
        return !!this.$attributes.deleted_at;
      }
    });

    Object.defineProperty(Model.prototype, 'wasTrashed', {
      get() {
        const dirtyAttributes = this.dirty;

        return 'deleted_at' in dirtyAttributes && !this.isTrashed;
      }
    });

    Object.defineProperty(Model, 'usesSoftDeletes', {
      get() {
        return true;
      }
    });
  }
}

module.exports = SoftDeletes;
