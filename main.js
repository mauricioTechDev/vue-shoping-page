// New instance which is a channel to tranport data from components to components...like a bus filled with data
var eventBus= new Vue()


Vue.component('product',{
  props: {
    premium:{
      type: Boolean,
      required: true
    },
  },
  template: `
  <div class="product">

    <div class="product-image">
      <img :src="image" alt="">
    </div>

    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock"> In Stock</p>
      <p v-else
         class="lineThrough">Out of Stock</p>
      <p>Shipping: {{ shipping }}</p>
      <p v-if="onSale">{{title}} are On Sale!</p>
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>

      <div v-for="(variant, index) in variants"
           v-bind:key="variant.variantId"
           class="color-box"
           v-bind:style="{ backgroundColor: variant.variantColor }"
           v-on:mouseover="updateProduct(index)">
      </div>

      <button v-on:click="addToCart"
              v-bind:disabled="!inStock"
              v-bind:class="{disabledButton: !inStock}">Add to Cart</button>

      <button @click="removeFromCart"
              >Remove From Cart</button>

      <product-tabs v-bind:reviews="reviews"></product-tabs>

    </div>

  </div>
  `,
  data(){
    return {brand: "Vue Mastery",
    product: 'socks',
    selectedVariant: 0,
    onSale: false,
    details: ["80% cotton", "20% pilyester", "gender-neutral"],
    variants:[
      {
        variantId: 2234,
        variantColor: "green",
        variantImage: "./images/vmSocks-green-onWhite.jpg",
        variantQuanity: 10
      },
      {
        variantId: 2235,
        variantColor: "blue",
        variantImage: "./images/vmSocks-blue-onWhite.jpg",
        variantQuanity: 0
      }
    ],
    reviews: []
    }
  },
  methods: {
    addToCart: function () {
     this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId )
   },
   removeFromCart: function () {
    this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId )
  },
    updateProduct: function (index){
      this.selectedVariant = index
      console.log(index)
    }
  },
  // these are the computed "properties" that can return a new prop they are chased until dependencies change
  computed: {
    title() {
      return `${this.brand} ${this.product}`
    },
    image(){
      return this.variants[this.selectedVariant].variantImage
    },
    inStock(){
      return this.variants[this.selectedVariant].variantQuanity
    },
    shipping(){
      if (this.premium){
        return "Free"
      } else {
        return 2.99
      }
    }
  },
  // lifecycle hook
  mounted(){
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})

Vue.component('product-tabs',{
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
  <div>
    <span class="tab"
          :class="{ activeTab: selectedTab === tab}"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="selectedTab = tab">
          {{ tab }}</span>
    <div v-show="selectedTab === 'Reviews'">
     <p v-if="!reviews.length">There are no reviews</p>
     <ul>
      <li v-for="review of reviews">
        {{ review.name }}
        <p>Review Rating: {{ review.rating }}</p>
        <p>{{ review.review }}</p>
        <p>Recommend: {{review.recommend}}</p>
      </li>
     </ul>
    </div>

    <product-review v-show="selectedTab === 'Make a Review'"></product-review>
  </div>
  `,
  data(){
    return {
        tabs: ['Reviews', 'Make a Review'],
        selectedTab: 'Reviews'
    }
  }
})

Vue.component('product-review', {
  template:`
  <form class="review-form" @submit.prevent="onSubmit">

  <p v-if="errors.length">

  <b>Please correct the following error(s)</b>

  <ul>
  <li v-for="error of errors">{{ error }}</li>
  </ul>

  </p>


      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
      <p>Would you recommend this product?</p>
      <div>
      <label for="Very Much">Very Much</label>
      <input type="radio" id="recommend" value="Very Much" v-model="recommend">
      </div>
      <div>
      <label for="Yes">Yes</label>
      <input type="radio" id="recommend" value="Yes" v-model="recommend">
      </div>
      <div>
      <label for="No"> No </label>
      <input type="radio" id="recommend" value="No" v-model="recommend">
      </div>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>

    </form>
  `,
  data(){
    return {
      name: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods: {
    onSubmit(){
    if(this.name && this.review && this.rating && this.recommend){
      let productReview = {
        name: this.name,
        review: this.review,
        rating: this. rating,
        recommend: this.recommend
      }
      eventBus.$emit('review-submitted', productReview)
      this.name = null,
      this.review = null,
      this.rating = null,
      this.recommend = null
    } else {
      if(!this.name) this.errors.push("Name required")
      if(!this.review) this.errors.push("Review required")
      if(!this.rating) this.errors.push("Rating required")
      if(!this.recommend) this.errors.push("Recommendation required")
    }
    }
  }
})

//VUE creates a new view instance
var app = new Vue({
  el: '#app',
  data:{
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id){
      this.cart.push(id)
    },
    removeFromCart(id){
      for(let i = this.cart.length - 1; i >= 0; i--){
        if(this.cart[i] === id){
          this.cart.splice(i,1)
          console.log("the number" + i)
          console.log(this.cart.length)
        }
      }
    }
  }
})
