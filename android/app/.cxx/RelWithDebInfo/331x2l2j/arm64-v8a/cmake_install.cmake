<<<<<<< HEAD:android/app/.cxx/Debug/37285o23/arm64-v8a/cmake_install.cmake
# Install script for directory: /home/lavue/Dev/js/React Native/BloodLinks-front/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup
=======
# Install script for directory: /home/mouope/Documents/Master 1/TPINF4057/Frontend/BloodLinks-front/node_modules/react-native/ReactAndroid/cmake-utils/default-app-setup
>>>>>>> origin/stefan:android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/cmake_install.cmake

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
<<<<<<< HEAD:android/app/.cxx/Debug/37285o23/arm64-v8a/cmake_install.cmake
    set(CMAKE_INSTALL_CONFIG_NAME "Debug")
=======
    set(CMAKE_INSTALL_CONFIG_NAME "RelWithDebInfo")
>>>>>>> origin/stefan:android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/cmake_install.cmake
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Install shared libraries without execute permission?
if(NOT DEFINED CMAKE_INSTALL_SO_NO_EXE)
  set(CMAKE_INSTALL_SO_NO_EXE "1")
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "TRUE")
endif()

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
<<<<<<< HEAD:android/app/.cxx/Debug/37285o23/arm64-v8a/cmake_install.cmake
  set(CMAKE_OBJDUMP "/home/lavue/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/bin/llvm-objdump")
=======
  set(CMAKE_OBJDUMP "/home/mouope/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/bin/llvm-objdump")
>>>>>>> origin/stefan:android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/cmake_install.cmake
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
<<<<<<< HEAD:android/app/.cxx/Debug/37285o23/arm64-v8a/cmake_install.cmake
  include("/home/lavue/Dev/js/React Native/BloodLinks-front/android/app/.cxx/Debug/37285o23/arm64-v8a/rnasyncstorage_autolinked_build/cmake_install.cmake")
  include("/home/lavue/Dev/js/React Native/BloodLinks-front/android/app/.cxx/Debug/37285o23/arm64-v8a/rnpicker_autolinked_build/cmake_install.cmake")
  include("/home/lavue/Dev/js/React Native/BloodLinks-front/android/app/.cxx/Debug/37285o23/arm64-v8a/rngesturehandler_codegen_autolinked_build/cmake_install.cmake")
  include("/home/lavue/Dev/js/React Native/BloodLinks-front/android/app/.cxx/Debug/37285o23/arm64-v8a/safeareacontext_autolinked_build/cmake_install.cmake")
  include("/home/lavue/Dev/js/React Native/BloodLinks-front/android/app/.cxx/Debug/37285o23/arm64-v8a/rnscreens_autolinked_build/cmake_install.cmake")
=======
  include("/home/mouope/Documents/Master 1/TPINF4057/Frontend/BloodLinks-front/android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/rnasyncstorage_autolinked_build/cmake_install.cmake")
  include("/home/mouope/Documents/Master 1/TPINF4057/Frontend/BloodLinks-front/android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/rnpicker_autolinked_build/cmake_install.cmake")
  include("/home/mouope/Documents/Master 1/TPINF4057/Frontend/BloodLinks-front/android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/rngesturehandler_codegen_autolinked_build/cmake_install.cmake")
  include("/home/mouope/Documents/Master 1/TPINF4057/Frontend/BloodLinks-front/android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/safeareacontext_autolinked_build/cmake_install.cmake")
  include("/home/mouope/Documents/Master 1/TPINF4057/Frontend/BloodLinks-front/android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/rnscreens_autolinked_build/cmake_install.cmake")
>>>>>>> origin/stefan:android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/cmake_install.cmake

endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
<<<<<<< HEAD:android/app/.cxx/Debug/37285o23/arm64-v8a/cmake_install.cmake
file(WRITE "/home/lavue/Dev/js/React Native/BloodLinks-front/android/app/.cxx/Debug/37285o23/arm64-v8a/${CMAKE_INSTALL_MANIFEST}"
=======
file(WRITE "/home/mouope/Documents/Master 1/TPINF4057/Frontend/BloodLinks-front/android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/${CMAKE_INSTALL_MANIFEST}"
>>>>>>> origin/stefan:android/app/.cxx/RelWithDebInfo/331x2l2j/arm64-v8a/cmake_install.cmake
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
