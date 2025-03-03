<script>
  let navItems = ["Dashboard", "Users", "Feedbacks", "Programs", "Resources", "Counterparties", "Events"];
</script>

<nav class="flex items-center justify-between px-6 py-4 bg-white shadow-md">
  <!-- Logo -->
  <div class="text-xl font-bold">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdoZz6QtckLWGuJhNYM3D_o5w3TkQ9j-9Rhw&s" alt="Logo" class="h-10" />
  </div>

  <!-- Navigation Items -->
  <ul class="flex space-x-6">
    {#each navItems as item}
      <li>
        <a href={"#" + item.toLowerCase()} class="text-gray-700 hover:text-orange-500 font-bold">{item}</a>
      </li>
    {/each}
  </ul>

  <!-- Right Icons (Flag and Account) -->
  <div class="flex items-center space-x-4">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_the_United_Kingdom_Square.svg/630px-Flag_of_the_United_Kingdom_Square.svg.png" alt="Flag" class="h-6" />
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYPRLSISP2uoEdGxNPVFrz02gI2KWiJ_VwNA&s" alt="Account" class="h-8 w-8 rounded-full" />
  </div>
</nav>