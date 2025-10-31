if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/home/lavue/.gradle/caches/9.0.0/transforms/6003b6c1b36fc02c7f725e4e86dcfdfb/transformed/hermes-android-0.82.1-release/prefab/modules/hermesvm/libs/android.x86_64/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/lavue/.gradle/caches/9.0.0/transforms/6003b6c1b36fc02c7f725e4e86dcfdfb/transformed/hermes-android-0.82.1-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

