"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import { useCurrentUser } from "@/features/auth";
import { useCart } from "@/features/cart";
import { useAddresses } from "@/features/addresses";
import { useCheckoutSummaryQuery, type CheckoutSummaryQueryParams } from "@/features/checkout";
import { useCreateOrderMutation } from "@/features/orders";
import { CheckoutProgressBar } from "./checkout-progress-bar";
import { CheckoutBillingForm } from "./checkout-billing-form";
import { CheckoutShippingForm } from "./checkout-shipping-form";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { CheckoutOrderConfirmed } from "./checkout-order-confirmed";
import { CheckoutLoadingState } from "./checkout-loading-state";
import { CheckoutEmptyState } from "./checkout-empty-state";
import { CheckoutInvalidBuyNowState } from "./checkout-invalid-buy-now";
import { BillingAddressModal } from "./billing-address-modal";
import { ShippingAddressModal } from "./shipping-address-modal";
import { useCheckoutPromo, useCouponToast } from "./use-checkout-promo";
import { useCheckoutAddressSelection } from "./use-checkout-address-selection";
import { useCheckoutPricing } from "./use-checkout-pricing";
import { useCheckoutOrderFlow } from "./use-checkout-order-flow";
import { useCheckoutQuantity } from "./use-checkout-quantity";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { items, summary, updateQuantity, isLoading: isCartLoading } = useCart();
  const {
    addresses, defaultAddress, isLoading: isAddressesLoading, isMutating,
    createAddress, createDualAddress, updateAddress, setDefaultAddress, deleteAddress,
  } = useAddresses();

  const createOrderMutation = useCreateOrderMutation();

  const {
    billingAddresses,
    shippingAddresses,
    selectedBillingId,
    selectedShippingId,
    selectedBillingAddress,
    selectedShippingAddress,
    sameAsBilling,
    setSameAsBilling,
    handleSelectBillingAddress,
    handleSelectShippingAddress,
    isBillingModalOpen,
    billingAddressToEdit,
    handleOpenBillingModal,
    handleCloseBillingModal,
    handleEditBillingAddress,
    isShippingModalOpen,
    shippingAddressToEdit,
    handleOpenShippingModal,
    handleCloseShippingModal,
    handleEditShippingAddress,
    handleAddressSubmit,
  } = useCheckoutAddressSelection({
    addresses, defaultAddress, setDefaultAddress,
    createAddress, createDualAddress, updateAddress,
  });

  const {
    couponInput,
    setCouponInput,
    appliedCouponCode,
    handleApplyPromo,
    handleRemovePromo,
  } = useCheckoutPromo();

  const searchParams = useSearchParams();
  const checkoutMode = searchParams.get("mode");
  const listingId = searchParams.get("listingId");
  const quantityParam = searchParams.get("quantity");

  const isBuyNow = checkoutMode === "buy-now";
  const parsedQuantity = Number(quantityParam);
  const buyNowQuantity =
    Number.isInteger(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;
  const isInvalidBuyNow = isBuyNow && !listingId;

  const summaryParams: CheckoutSummaryQueryParams = {
    shippingAddressId: selectedShippingId || undefined,
    billingAddressId: selectedBillingId || undefined,
    billingSameAsShipping: sameAsBilling ? "true" : "false",
    couponCode: appliedCouponCode || undefined,
    ...(isBuyNow && listingId ? { bookListingId: listingId, quantity: buyNowQuantity } : {}),
  };

  const isSummaryEnabled = isBuyNow ? Boolean(listingId) : items.length > 0;

  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
  } = useCheckoutSummaryQuery(summaryParams, { enabled: isSummaryEnabled });

  const { handleUpdateQuantity, isUpdating: isQuantityUpdating } = useCheckoutQuantity({
    isBuyNow,
    updateQuantity,
  });

  const checkoutSummary = summaryResponse?.data;

  const {
    activeItems,
    activeSubtotal,
    activeTotalMrp,
    activeMrpSavings,
    activeCouponDiscount,
    activeDeliveryCharge,
    activeTotalAmount,
    canCheckout,
    checkoutIssues,
    captureSnapshot,
  } = useCheckoutPricing({
    checkoutSummary,
    summary,
    items,
    isOrderComplete: false,
    isPlacingOrder: false,
    isBuyNow,
    buyNowQuantity,
  });

  useCouponToast(appliedCouponCode, checkoutSummary?.coupon);

  const initialUser = user
    ? { name: user.name, email: user.email, mobileNumber: user.mobileNumber }
    : null;

  const {
    paymentMethod,
    setPaymentMethod,
    acceptedTerms,
    setAcceptedTerms,
    isOrderComplete,
    setIsOrderComplete,
    orderNumber,
    isPlacingOrder,
    handleProceedToPayment,
  } = useCheckoutOrderFlow({
    user,
    activeItems,
    selectedBillingAddress,
    selectedShippingAddress,
    selectedBillingId,
    selectedShippingId,
    sameAsBilling,
    appliedCouponCode,
    canCheckout,
    checkoutIssues,
    captureSnapshot,
    handleOpenAddModal: (type) =>
      type === "SHIPPING" ? handleOpenShippingModal() : handleOpenBillingModal(),
    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    isBuyNow,
    buyNowListingId: listingId,
    buyNowQuantity,
  });

  const isInitialLoading =
    (isCartLoading || isUserLoading || isAddressesLoading || (isSummaryEnabled && isSummaryLoading)) &&
    !isPlacingOrder &&
    !isOrderComplete &&
    activeItems.length === 0;

  if (isInitialLoading) {
    return <CheckoutLoadingState />;
  }

  if (isInvalidBuyNow) {
    return <CheckoutInvalidBuyNowState />;
  }

  const hasNoItems = isBuyNow
    ? activeItems.length === 0
    : items.length === 0 && activeItems.length === 0;

  if (hasNoItems && !isOrderComplete && !isPlacingOrder) {
    return <CheckoutEmptyState />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <CategoryBanner categoryName="Checkout" compact />

      <main className="relative z-20 -mt-6 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CheckoutProgressBar />

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-8">
              <CheckoutBillingForm
                addresses={billingAddresses}
                selectedAddressId={selectedBillingId}
                onSelectAddress={handleSelectBillingAddress}
                onOpenAddModal={handleOpenBillingModal}
                onEditAddress={handleEditBillingAddress}
                onDeleteAddress={deleteAddress}
                onSetDefaultAddress={setDefaultAddress}
                sameAsBilling={sameAsBilling}
                onSameAsBillingChange={setSameAsBilling}
              />

              <CheckoutShippingForm
                selectedBillingAddress={selectedBillingAddress}
                addresses={shippingAddresses}
                selectedShippingAddressId={selectedShippingId}
                onSelectShippingAddress={handleSelectShippingAddress}
                onOpenAddModal={handleOpenShippingModal}
                onEditAddress={handleEditShippingAddress}
                onDeleteAddress={deleteAddress}
                onSetDefaultAddress={setDefaultAddress}
                sameAsBilling={sameAsBilling}
                onSetSameAsBilling={setSameAsBilling}
              />
            </div>

            <div className="lg:col-span-4">
              <CheckoutOrderSummary
                items={activeItems}
                subtotal={activeSubtotal}
                totalMrp={activeTotalMrp}
                mrpSavings={activeMrpSavings}
                totalAmount={activeTotalAmount}
                couponCode={couponInput}
                onCouponCodeChange={setCouponInput}
                appliedCoupon={appliedCouponCode}
                couponDiscount={activeCouponDiscount}
                couponMessage={checkoutSummary?.coupon?.message}
                isCouponValid={checkoutSummary?.coupon?.isValid ?? true}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                availablePaymentMethods={checkoutSummary?.paymentMethods}
                acceptedTerms={acceptedTerms}
                onAcceptedTermsChange={setAcceptedTerms}
                isProcessing={isPlacingOrder || createOrderMutation.isPending}
                canCheckout={canCheckout}
                checkoutIssues={checkoutIssues}
                deliveryCharge={activeDeliveryCharge}
                deliveryDays={
                  checkoutSummary?.delivery
                    ? { min: checkoutSummary.delivery.estimatedMinDays, max: checkoutSummary.delivery.estimatedMaxDays }
                    : undefined
                }
                onProceed={handleProceedToPayment}
                onUpdateQuantity={handleUpdateQuantity}
                isUpdatingQuantity={isQuantityUpdating || isSummaryFetching}
              />
            </div>
          </div>
        </div>
      </main>

      <BillingAddressModal
        isOpen={isBillingModalOpen}
        onClose={handleCloseBillingModal}
        addressToEdit={billingAddressToEdit}
        initialUser={initialUser}
        onSubmit={handleAddressSubmit}
        isSubmitting={isMutating}
      />

      <ShippingAddressModal
        isOpen={isShippingModalOpen}
        onClose={handleCloseShippingModal}
        addressToEdit={shippingAddressToEdit}
        initialUser={initialUser}
        onSubmit={handleAddressSubmit}
        isSubmitting={isMutating}
      />

      <CheckoutOrderConfirmed
        isOpen={isOrderComplete}
        onClose={() => {
          setIsOrderComplete(false);
          router.replace("/orders");
        }}
        orderNumber={orderNumber}
      />
    </div>
  );
}