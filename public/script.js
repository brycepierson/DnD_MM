
var app = new Vue({
  el: '#app',
  data: {
    ip: "localhost",
    items: [],
    myTeam: [],
    myTeamVisible: 'False',
    filteredLetter: '',
    STRfilter: 0,
    DEXfilter: 0,
    CONfilter: 0,
    INTfilter: 0,
    WISfilter: 0,
    CHAfilter: 0,
  },
  created: function() {
    this.getItems();
    this.getMyTeam();
  },
  computed: {
    myTeamSize: function() {
      return this.myTeam.length;
    },
    filteredItems: function() {
      if(this.myTeamVisible === 'True'){
        return this.myTeam;
      }
      tempList = []
      if(this.filteredLetter != ''){
        tempList = this.items.filter(item => {
          return item.name.toLowerCase().charAt(0) === this.filteredLetter;
        })
      }
      else{
        tempList = this.items;
      }
      tempList = tempList.filter(item => {
        return item.STR >= parseInt(this.STRfilter);
      })
      tempList = tempList.filter(item => {
        return item.DEX >= parseInt(this.DEXfilter);
      })
      tempList = tempList.filter(item => {
        return item.CON >= parseInt(this.CONfilter);
      })
      tempList = tempList.filter(item => {
        return item.INT >= parseInt(this.INTfilter);
      })
      tempList = tempList.filter(item => {
        return item.WIS >= parseInt(this.WISfilter);
      })
      tempList = tempList.filter(item => {
        return item.CHA >= parseInt(this.CHAfilter);
      })
      return tempList;
    },
  },
  methods: {
    addToCart: function(item) {
      json = JSON.stringify(item)
        axios.post("http://"+ this.ip + ":4000/api/cart", {monster:json}
  	).then(response => {
      var audio = new Audio('/audio/added.mp3')
      audio.play();
      this.getMyTeam();
  	   return true;
    }).catch(err => {
    });
    },

    getMyTeam: function() {
      axios.get("http://"+ this.ip + ":4000/api/cart").then(response => {
        this.myTeam = response.data;
        return true;
      }).catch(err => {
      });
    },
    firstLetterFilter: function(letter){
      this.filteredLetter = letter;
    },
    showMyTeam: function(){
      this.myTeamVisible = 'True';
    },
    hideMyTeam: function(){
      this.myTeamVisible = 'False';
    },

    getItems: function() {
      fetch("./mmm.json").then(response => {
        return response.json();
      }).then(json=> {
        console.log(json);
        this.items = json;
        return true;
      }).catch(err => {
        console.log(err);
      });
    },
    removeFromCart: function(item) {
      axios.delete("http://"+ this.ip + ":4000/api/cart/" + item.name.replace(/\s+/g, '-'))
      .then(response => {
	this.getMyTeam();
	return true;
      }).catch(err => {
      });
    }


  }
});
