// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },
    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var storage = [];
      for (var i = 0; i < row.length; i++) {
        if (row[i]) {
          storage.push (row[i]);
        }
      }
      // checks if there has been found a conflict in a row
      if (storage.length > 1) {
        return true;
      } else {
        return false; // fixme
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // iterate sending rows to hasRowConflict
      for (var j = 0; j < this.get('n'); j++) {
        //if it found conflict on row j
        if (this.hasRowConflictAt(j)) {
          return true;
        }

      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // for loop with n ('n' is the whole array at index 'n')
      var columnArray = [];
      var storage = [];
      for (var j = 0; j < this.get('n'); j++) {
        // iterate through the row === [row array] (this.get(i))
        // retrieve row[colIndex]
        columnArray.push(this.get(j)[colIndex]);
      }
      for (var i = 0; i < columnArray.length; i++) {
        if (columnArray[i]) {
          // push to storage array
          storage.push(columnArray[i]);
        }
      }
      if (storage.length > 1) {
        return true;
      } else {
        return false; // fixme
      }
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for (var j = 0; j < this.get('n'); j++) {
        if (this.hasColConflictAt(j)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // console.log('--- New Test begins ---');
      // console.log('just major: ', majorDiagonalColumnIndexAtFirstRow);
      // console.log('Diagonal index ', this.get(majorDiagonalColumnIndexAtFirstRow));
      // iterate through this.get(majorDiagonalColumnIndexAtFirstRow) checking for
      // without this.get majorDiagonalColumnIndexAtFirstRow
      var completeMatrix = [];
      var storage = [];
      var colIndex = majorDiagonalColumnIndexAtFirstRow;
      var myRow = 0;
      //iterate to get matrix of rows
      for (var rowIndex = 0; rowIndex < this.get('n'); rowIndex++) {
        completeMatrix.push(this.get(rowIndex));
      }
      // console.log('Complete Matrix is ', completeMatrix);
      // iterate through elements of matrix
      for (var row = 0; row < completeMatrix.length; row++) {
        // checking if index is truth(1)
        // console.log('Is row->', row, ' col ->', colIndex, '-- Element is# ', completeMatrix[row][colIndex])
        if (completeMatrix[row][colIndex] ) {
          // console.log('**element being pushed to storage** row->', row, ' col ->', colIndex)
          // push to storage array
          storage.push(completeMatrix[row][colIndex]);

        }
        // make this expression run once
       /*if (majorDiagonalColumnIndexAtFirstRow === 0 && completeMatrix[0][majorDiagonalColumnIndexAtFirstRow] === 0 && row === 0) {
          console.log('INSIDE OF THE 0 & 0 STATEMENT, with row', row)
          continue;
        }*/
        colIndex++;
      }
      // console.log('Storage is iteration through matrix -> ', storage);
      // console.log('hasMajorDiagonalConflict? ', storage.length > 1);
      if (storage.length > 1) {
        return true;
      } else {
        return false; // fixme
      }
    },


    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      for (var j = 0; j < this.get('n'); j++) {
        // console.log('Is there a  rowConflictAt? ', this.hasRowConflictAt(j));
        if (this.hasMajorDiagonalConflictAt(j)) {
          // console.log('inside if has to return false:')
          return true;
        } // fixme

      }
      return false;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var completeMatrix = [];
      var storage = [];
      var colIndex = minorDiagonalColumnIndexAtFirstRow;
      //iterate to get matrix of rows
      for (var rowIndex = 0; rowIndex < this.get('n'); rowIndex++) {
        completeMatrix.push(this.get(rowIndex));
      }
      for (var row = 0; row < completeMatrix.length; row++) {
        if (completeMatrix[row][colIndex]) {
          // push to storage array
          storage.push(completeMatrix[row][colIndex]);
        }
        colIndex--;
      }
      if (storage.length > 1) {
        return true;
      } else {
        return false;
      }


    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (var j = 0; j < this.get('n'); j++) {
        // console.log('Is there a  rowConflictAt? ', this.hasRowConflictAt(j));
        if (this.hasMinorDiagonalConflictAt(j)) {
          // console.log('inside if has to return false:')
          return true;
        } // fixme

      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
